import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { MdOutlineDesignServices } from "react-icons/md";
import { useApi } from "@/contexts/ApiProvider";
import { LuSettings2 } from "react-icons/lu";

function ShoeSection({
  title,
  group,
  stlFilesVisibility,
  handleToggleVisibility,
  showPressureImage,
  togglePressureImage,
  shoeVisibility,
  handleShoeVisibilityChange,
  shoeColor,
  handleShoeColorChange,
  skeletonColor,
  handleSkeletonColorChange,
  isTitle,
  isRight,
}) {
  const items = ["InternalStructure", "FootShoe", "Skeleton", "Floor", "Roof"];

  return (
    <div className="flex flex-col space-y-2 p-8 ">
      {isTitle ? (
        <div className="flex items-center gap-2 text-white pb-2">
          <MdOutlineDesignServices className="h-6 w-6 text-sky-500" />
          Automatic insole design:
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white pb-2">
          <MdOutlineDesignServices className="h-6 w-6 text-primary" />
        </div>
      )}

      <div className="flex   ">
        <div className="flex flex-col gap-1">
          {!isRight ? (
            <>
              <span className="text-gray-300">{items[0]}</span>
              <span className="text-gray-300">{items[1]}</span>
              <span className="text-gray-300">{items[2]}</span>
              <span className="text-gray-300">{items[3]}</span>
              <span className="text-gray-300">{items[4]}</span>
            </>
          ) : null}
        </div>

        <div className="flex  flex-col gap-1">
          {group.map((file, index) => (
            <div
              key={file.filename}
              className={`flex  ${
                isRight ? "justify-center w-1/2 " : "justify-between ml-12 -mr-4"
              } items-center ml-8 `}
            >
              {/* Use the items array based on the index from the group */}

              <label className={`flex flex-col  items-center cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={stlFilesVisibility[file.filename]}
                  onChange={() => handleToggleVisibility(file.filename)}
                  className="mr-2 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                {/* Uncomment to display the filename */}
                {/* <span className="text-xs font-medium text-gray-400">{file.filename}</span> */}
              </label>
            </div>
          ))}
        </div>
      </div>


<div className="flex justify-between items-center -mt-2">
{
        !isRight ?  <span className="text-xs font-medium text-gray-400">{showPressureImage ? `Pressure Image` : `Pressure Image`}</span> : null
       }

<div >
<label
        className={`ml-8 flex items-center ${
          !isRight ? "justify" : "justify-start"
        } cursor-pointer mb-2`}
      >
     
        <input
          type="checkbox"
          checked={showPressureImage}
          onChange={togglePressureImage}
          className="mr-7 -mt-1 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        {/* Uncomment to display the pressure image text */}
      
      </label>
</div>
</div>

      {isTitle ? (
        <div className="flex items-center gap-2 text-white pt-2 pb-2">
          <LuSettings2 className="h-6 w-6 text-sky-500" /> Edit design
          structure:
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white pt-2 pb-2">
          <LuSettings2 className="h-6 w-6 text-primary" />
        </div>
      )}

      {/* Slider for Shoe Visibility */}
      <div className="ml-8 flex flex-col w-2/3">
        <label className="text-gray-300 text-sm">{`${title} Foot Shoe Visibility:`}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={shoeVisibility}
          onChange={(e) => handleShoeVisibilityChange(Number(e.target.value))}
          className="mt-2 hover:cursor-grabbing"
        />
      </div>

      {/* Color Picker for Shoe */}
      <div className="ml-8 flex flex-col">
        <label className="text-gray-300 text-sm">{`${title} Foot Shoe Color:`}</label>
        <input
          type="color"
          value={shoeColor}
          onChange={handleShoeColorChange}
          className="mt-2"
        />
      </div>

      {/* Color Picker for Skeleton Color */}
      <div className="ml-8 flex flex-col">
        <label className="text-gray-300 text-sm">{`${title} Skeleton Color:`}</label>
        <input
          type="color"
          value={skeletonColor}
          onChange={handleSkeletonColorChange}
          className="mt-2"
        />
      </div>
    </div>
  );
}

function STLViewer({ id }) {
  const canvasRef = useRef(null);
  const [stlFiles, setStlFiles] = useState([]);
  const [stlFilesVisibility, setStlFilesVisibility] = useState({});
  const [showLeftPressureImage, setShowLeftPressureImage] = useState(true);
  const [showRightPressureImage, setShowRightPressureImage] = useState(true);
  const [leftShoeVisibility, setLeftShoeVisibility] = useState(1);
  const [rightShoeVisibility, setRightShoeVisibility] = useState(1);
  const [leftShoeColor, setLeftShoeColor] = useState("#FFFFFF");
  const [rightShoeColor, setRightShoeColor] = useState("#FFFFFF");
  const [leftSkeletonColor, setLeftSkeletonColor] = useState("#FFFFFF");
  const [rightSkeletonColor, setRightSkeletonColor] = useState("#FFFFFF");
  const api = useApi();
  const engineRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    engineRef.current = engine;

    const createScene = () => {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0.15, 0.15, 0.16, 1);

      const camera = new BABYLON.ArcRotateCamera(
        "camera1",
        Math.PI / 2,
        Math.PI / 3,
        4,
        BABYLON.Vector3.Zero(),
        scene
      );

      camera.upperRadiusLimit = 800;
      camera.lowerRadiusLimit = 50;
      camera.lowerBetaLimit = 0.1;
      camera.upperBetaLimit = Math.PI - 0.1;
      camera.inertia = 0.9;
      camera.setPosition(new BABYLON.Vector3(-300, 352, -450));

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
        const response = await api.get(`/api/examinations/${id}/fetch-stl/`);
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

  const loadStlFiles = async (files) => {
    if (!sceneRef.current) return;

    for (const file of files) {
        try {
            const response = await fetch(`/api/download-stl?filename=${encodeURIComponent(file.filename)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const download_link = URL.createObjectURL(blob); // Create a temporary URL for the blob

            BABYLON.SceneLoader.ImportMesh(
                "",
                "",
                download_link, // Use the blob's URL
                sceneRef.current,
                (meshes) => {
                    meshes.forEach((mesh) => {
                        mesh.name = file.filename;
                        // ... (rest of your mesh processing)
                    });
                },
                null,
                (scene, message, exception) => {
                    console.error("Error loading STL file:", message, exception);
                }
            );

        } catch (error) {
            console.error(`Error downloading and importing ${file.filename}:`, error);
        }
    }
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
      const leftMesh = sceneRef.current.getMeshByName(
        "Left_InternalStructure_Hollow.STL"
      );
      if (leftMesh) {
        leftMesh.material.alpha = newState ? 1 : 0;
      }
      return newState;
    });
  };

  const handleToggleRightPressureImage = () => {
    setShowRightPressureImage((prev) => {
      const newState = !prev;
      const rightMesh = sceneRef.current.getMeshByName(
        "Right_InternalStructure_Hollow.STL"
      );
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
      leftShoeMesh.material.diffuseColor =
        BABYLON.Color3.FromHexString(newColor);
      leftShoeMesh.material.needsRefresh = true;
    }
  };

  const handleRightShoeColorChange = (event) => {
    const newColor = event.target.value;
    setRightShoeColor(newColor);
    const rightShoeMesh = sceneRef.current.getMeshByName("Right_FootShoe.STL");
    if (rightShoeMesh && rightShoeMesh.material) {
      rightShoeMesh.material.diffuseColor =
        BABYLON.Color3.FromHexString(newColor);
      rightShoeMesh.material.needsRefresh = true;
    }
  };

  const handleLeftSkeletonColorChange = (event) => {
    const newColor = event.target.value;
    setLeftSkeletonColor(newColor);
    const leftSkeletonMesh =
      sceneRef.current.getMeshByName("Left_Skeleton.STL");
    if (leftSkeletonMesh && leftSkeletonMesh.material) {
      leftSkeletonMesh.material.diffuseColor =
        BABYLON.Color3.FromHexString(newColor);
      leftSkeletonMesh.material.needsRefresh = true;
    }
  };

  const handleRightSkeletonColorChange = (event) => {
    const newColor = event.target.value;
    setRightSkeletonColor(newColor);
    const rightSkeletonMesh =
      sceneRef.current.getMeshByName("Right_Skeleton.STL");
    if (rightSkeletonMesh && rightSkeletonMesh.material) {
      rightSkeletonMesh.material.diffuseColor =
        BABYLON.Color3.FromHexString(newColor);
      rightSkeletonMesh.material.needsRefresh = true;
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
    const light1 = new BABYLON.DirectionalLight(
      "light1",
      new BABYLON.Vector3(1, -1, 1),
      scene
    );
    light1.position.set(0, 0, 0);
    light1.diffuse = new BABYLON.Color3(204 / 255, 204 / 255, 204 / 255);
    light1.specular = new BABYLON.Color3(63 / 255, 63 / 255, 63 / 255);

    const light2 = new BABYLON.DirectionalLight(
      "light2",
      new BABYLON.Vector3(-1, -1, 0.5),
      scene
    );
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
      <div className="flex items-center gap-4 -mt-5 mb-14">
        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-400"></div>
        <h1 className="text-xl text-center dark:text-white font-bold">
          STL Viewer
        </h1>
        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-400"></div>
      </div>
      <div className="flex flex-row-reverse items-center justify-center gap-10 ">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-lg gap-12">
          <canvas
            className="mx-auto border border-zinc-400 rounded-md p-2 bg-zinc-800"
            style={{ width: "950px", height: "550px", borderRadius: "13px" }}
            ref={canvasRef}
          />
          <div className="flex flex-col bg-[#7D7C7D] dark:bg-zinc-800 -mr-5 rounded-xl ">
            <div className="flex justify-center items-center gap-4 mb-4 mt-6">
              <div className="w-20 md:w-28 h-[0.5px] bg-sky-400"></div>
              <h1 className="text-xl text-center text-white font-bold">
                Settings
              </h1>
              <div className="w-20 md:w-28 h-[0.5px] bg-sky-400"></div>
            </div>
            <div className="flex -space-x-14  ">
              <ShoeSection
                title="Left"
                group={leftGroup}
                stlFilesVisibility={stlFilesVisibility}
                handleToggleVisibility={handleToggleVisibility}
                showPressureImage={showLeftPressureImage}
                togglePressureImage={handleToggleLeftPressureImage}
                shoeVisibility={leftShoeVisibility}
                handleShoeVisibilityChange={handleLeftShoeVisibilityChange}
                shoeColor={leftShoeColor}
                handleShoeColorChange={handleLeftShoeColorChange}
                skeletonColor={leftSkeletonColor}
                handleSkeletonColorChange={handleLeftSkeletonColorChange}
                isTitle={true}
                isRight={false}
              />
              <ShoeSection
                title="Right"
                group={rightGroup}
                stlFilesVisibility={stlFilesVisibility}
                handleToggleVisibility={handleToggleVisibility}
                showPressureImage={showRightPressureImage}
                togglePressureImage={handleToggleRightPressureImage}
                shoeVisibility={rightShoeVisibility}
                handleShoeVisibilityChange={handleRightShoeVisibilityChange}
                shoeColor={rightShoeColor}
                handleShoeColorChange={handleRightShoeColorChange}
                skeletonColor={rightSkeletonColor}
                handleSkeletonColorChange={handleRightSkeletonColorChange}
                isTitle={false}
                isRight={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default STLViewer;
