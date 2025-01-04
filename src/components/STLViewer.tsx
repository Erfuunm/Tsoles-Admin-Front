import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { MdOutlineDesignServices } from "react-icons/md";
import { useApi } from "@/contexts/ApiProvider";
import { LuSettings2 } from "react-icons/lu";

function STLViewer() {
  const canvasRef = useRef(null);
  const [stlFiles, setStlFiles] = useState([]);
  const [stlFilesVisibility, setStlFilesVisibility] = useState({});
  const [showLeftPressureImage, setShowLeftPressureImage] = useState(true);
  const [showRightPressureImage, setShowRightPressureImage] = useState(true);
  const [leftShoeVisibility, setLeftShoeVisibility] = useState(1);
  const [rightShoeVisibility, setRightShoeVisibility] = useState(1);
  const [leftShoeColor, setLeftShoeColor] = useState("#FFFFFF");
  const [rightShoeColor, setRightShoeColor] = useState("#FFFFFF");
  const api = useApi();
  const engineRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    engineRef.current = engine;

    const createScene = () => {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0.3, 0.3, 0.3, 1);
      const camera = new BABYLON.ArcRotateCamera(
        "camera1",
        Math.PI / 2,
        Math.PI / 2,
        2,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.attachControl(canvas, true);
      addLights(scene);

      sceneRef.current = scene;
      return scene;
    };

    const renderScene = () => {
      if (sceneRef.current) {
        sceneRef.current.render();
      }
    };

    const scene = createScene();
    engine.runRenderLoop(renderScene);

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    const fetchStlFiles = async () => {
      try {
        const response = await api.get("/api/examinations/11/fetch-stl/");
        const files = response.body.files;

        const visibility = {};
        files.forEach((file) => {
          visibility[file.filename] = true; 
        });

        setStlFiles(files);
        setStlFilesVisibility(visibility); 
        loadStlFiles(files);
      } catch (error) {
        console.error("Error fetching STL files:", error);
      }
    };

    fetchStlFiles();
  }, [api]);

  const loadStlFiles = (files) => {
    if (!sceneRef.current) return;

    files.forEach((file) => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "",
        file.download_link,
        sceneRef.current,
        (meshes) => {
          meshes.forEach((mesh) => {
            mesh.name = file.filename; 

            const material = new BABYLON.StandardMaterial(mesh.name + "Material", sceneRef.current);
            material.diffuseColor = new BABYLON.Color3(1, 1, 1); // Default color

            if (file.filename === "Right_InternalStructure_Hollow.STL") {
              const texture = new BABYLON.Texture("/DesignSample/PressureImageRight.JPG", sceneRef.current);
              texture.vAng = Math.PI - 0.16;
              texture.uAng = Math.PI + 0.19;
              texture.wAng = (-10 * Math.PI) / 180;
              texture.vOffset = 0.56;
              material.diffuseTexture = texture;
            } else if (file.filename === "Left_InternalStructure_Hollow.STL") {
              const texture = new BABYLON.Texture("/DesignSample/PressureImageLeft.JPG", sceneRef.current);
              texture.wAng = Math.PI;
              texture.vOffset = 0.35;
              texture.uOffset = -0.2;
              material.diffuseTexture = texture;
            }

            mesh.material = material;
            generatePlanarUVs(mesh);
          });
        },
        null,
        (scene, message, exception) => {
          console.error("Error loading STL file:", message, exception);
        }
      );
    });
  };

  const handleToggleVisibility = (filename) => {
    setStlFilesVisibility((prevState) => {
      const newVisibility = { ...prevState, [filename]: !prevState[filename] };
      const mesh = sceneRef.current.getMeshByName(filename);
      if (mesh) {
        mesh.isVisible = newVisibility[filename];
      }
      return newVisibility;
    });
  };

  const handleToggleLeftPressureImage = () => {
    setShowLeftPressureImage((prev) => {
      const newState = !prev;
      const leftMesh = sceneRef.current.getMeshByName("Left_InternalStructure_Hollow.STL");
      if (leftMesh) {
        leftMesh.material.alpha = newState ? 1 : 0;
      }
      return newState;
    });
  };

  const handleToggleRightPressureImage = () => {
    setShowRightPressureImage((prev) => {
      const newState = !prev;
      const rightMesh = sceneRef.current.getMeshByName("Right_InternalStructure_Hollow.STL");
      if (rightMesh) {
        rightMesh.material.alpha = newState ? 1 : 0;
      }
      return newState;
    });
  };

  const handleLeftShoeVisibilityChange = (value) => {
    setLeftShoeVisibility(value);
    const leftShoeMesh = sceneRef.current.getMeshByName("Left_FootShoe.STL");
    if (leftShoeMesh) {
      leftShoeMesh.visibility = value;
    }
  };

  const handleRightShoeVisibilityChange = (value) => {
    setRightShoeVisibility(value);
    const rightShoeMesh = sceneRef.current.getMeshByName("Right_FootShoe.STL");
    if (rightShoeMesh) {
      rightShoeMesh.visibility = value;
    }
  };

  const handleLeftShoeColorChange = (event) => {
    const newColor = event.target.value;
    setLeftShoeColor(newColor);
    const leftShoeMesh = sceneRef.current.getMeshByName("Left_FootShoe.STL");
    if (leftShoeMesh && leftShoeMesh.material) {
      leftShoeMesh.material.diffuseColor = BABYLON.Color3.FromHexString(newColor); // Change color
      leftShoeMesh.material.needsRefresh = true; // Notify Babylon to refresh the material
    }
  };

  const handleRightShoeColorChange = (event) => {
    const newColor = event.target.value;
    setRightShoeColor(newColor);
    const rightShoeMesh = sceneRef.current.getMeshByName("Right_FootShoe.STL");
    if (rightShoeMesh && rightShoeMesh.material) {
      rightShoeMesh.material.diffuseColor = BABYLON.Color3.FromHexString(newColor); // Change color
      rightShoeMesh.material.needsRefresh = true; // Notify Babylon to refresh the material
    }
  };

  const generatePlanarUVs = (mesh) => {
    const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const uvs = [];
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      uvs.push(x * 0.0034);
      uvs.push(z * 0.0034);
    }
    mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs);
  };

  const addLights = (scene) => {
    const light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, -1, 1), scene);
    light1.position.set(0, 0, 0);
    light1.diffuse = new BABYLON.Color3(204 / 255, 204 / 255, 204 / 255);
    light1.specular = new BABYLON.Color3(63 / 255, 63 / 255, 63 / 255);

    const light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-1, -1, 0.5), scene);
    light2.position.set(0, 0, 0);
    light2.diffuse = new BABYLON.Color3(63 / 255, 63 / 255, 63 / 255);
    light2.specular = new BABYLON.Color3(0, 0, 0);
  };

  const splitFilesIntoGroups = (files) => {
    const midIndex = Math.ceil(files.length / 2);
    return [files.slice(0, midIndex), files.slice(midIndex)];
  };

  const [leftGroup, rightGroup] = splitFilesIntoGroups(stlFiles);

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <div className="flex items-center gap-4 -mt-20 mb-14">
        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-400"></div>
        <h1 className="text-xl text-center text-white font-bold">STL Viewer</h1>
        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-400"></div>
      </div>
      <div className="flex flex-row-reverse items-center justify-center gap-10 ">
        <div className="flex items-center justify-between p-8 rounded-lg gap-6">
          <div className="flex flex-col space-y-2 bg-zinc-800 p-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-20 md:w-20 h-[0.5px] bg-sky-400"></div>
              <h1 className="text-xl text-center text-white font-bold">Left</h1>
              <div className="w-20 md:w-20 h-[0.5px] bg-sky-400"></div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <MdOutlineDesignServices className="h-6 w-6 text-sky-500" />{" "}
              Automatic insole design :
            </div>
            {leftGroup.map((file) => (
              <div key={file.filename} className="ml-8 flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stlFilesVisibility[file.filename]}
                    onChange={() => handleToggleVisibility(file.filename)}
                    className="mr-2 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-400">
                    {file.filename}
                  </span>
                </label>
              </div>
            ))}

            <div className="flex items-center gap-2 text-white">
              <LuSettings2 className="h-6 w-6 text-sky-500" /> Edit design
              structure :
            </div>

            <label className="ml-8 flex items-center cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={showLeftPressureImage}
                onChange={handleToggleLeftPressureImage}
                className="mr-2 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-400">
                {showLeftPressureImage
                  ? "Hide Left Pressure Image"
                  : "Show Left Pressure Image"}
              </span>
            </label>

            {/* Slider for Left Foot Shoe Visibility */}
            <div className="flex flex-col">
              <label className="text-white">Left Foot Shoe Visibility:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={leftShoeVisibility}
                onChange={(e) => handleLeftShoeVisibilityChange(Number(e.target.value))}
                className="mt-2"
              />
            </div>

            {/* Color Picker for Left Foot Shoe */}
            <div className="flex flex-col">
              <label className="text-white">Left Foot Shoe Color:</label>
              <input
                type="color"
                value={leftShoeColor}
                onChange={handleLeftShoeColorChange}
                className="mt-2"
              />
            </div>
          </div>
          <canvas
            className="mx-auto border-2 border-gray-300 bg-white"
            style={{ width: "800px", height: "450px" }}
            ref={canvasRef}
          />
          <div className="flex flex-col h-full space-y-2 bg-zinc-800 p-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-20 md:w-20 h-[0.5px] bg-sky-400"></div>
              <h1 className="text-xl text-center text-white font-bold">
                Right
              </h1>
              <div className="w-20 md:w-20 h-[0.5px] bg-sky-400"></div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <MdOutlineDesignServices className="h-6 w-6 text-sky-500" />{" "}
              Automatic insole design :
            </div>
            {rightGroup.map((file) => (
              <div key={file.filename} className="pl-8 mt-4 mb-4 flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stlFilesVisibility[file.filename]}
                    onChange={() => handleToggleVisibility(file.filename)}
                    className="mr-2 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-400">
                    {file.filename}
                  </span>
                </label>
              </div>
            ))}
            <div className="flex items-center gap-2 text-white">
              <LuSettings2 className="h-6 w-6 text-sky-500" /> Edit design
              structure :
            </div>
            <label className="ml-8 flex items-center cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={showRightPressureImage}
                onChange={handleToggleRightPressureImage}
                className="mr-2 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-400">
                {showRightPressureImage
                  ? "Hide Right Pressure Image"
                  : "Show Right Pressure Image"}
              </span>
            </label>

            {/* Slider for Right Foot Shoe Visibility */}
            <div className="flex flex-col">
              <label className="text-white">Right Foot Shoe Visibility:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={rightShoeVisibility}
                onChange={(e) => handleRightShoeVisibilityChange(Number(e.target.value))}
                className="mt-2"
              />
            </div>

            {/* Color Picker for Right Foot Shoe */}
            <div className="flex flex-col">
              <label className="text-white">Right Foot Shoe Color:</label>
              <input
                type="color"
                value={rightShoeColor}
                onChange={handleRightShoeColorChange}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default STLViewer;