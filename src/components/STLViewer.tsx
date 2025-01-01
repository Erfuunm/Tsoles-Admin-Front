import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { useApi } from "@/contexts/ApiProvider";

function STLViewer() {
  const canvasRef = useRef(null);
  const [stlFiles, setStlFiles] = useState([]);
  const [stlFilesVisibility, setStlFilesVisibility] = useState({});
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
      const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
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

    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    const fetchStlFiles = async () => {
      try {
        const response = await api.get('/api/examinations/11/fetch-stl/');
        const files = response.body.files;

        const visibility = {};
        files.forEach((file) => {
          visibility[file.filename] = true; // Set initial visibility to true
        });

        setStlFiles(files);
        setStlFilesVisibility(visibility); // Update visibility state
        loadStlFiles(files); // Load the STL files after fetching
      } catch (error) {
        console.error('Error fetching STL files:', error);
      }
    };

    fetchStlFiles();
  }, [api]);

  const loadStlFiles = (files) => {
    if (!sceneRef.current) return;

    files.forEach(file => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "",
        file.download_link,
        sceneRef.current,
        (meshes) => {
          meshes.forEach(mesh => {
            mesh.name = file.filename; // Set mesh name to filename for later reference
            generatePlanarUVs(mesh);
          });
        },
        null,
        (scene, message, exception) => {
          console.error('Error loading STL file:', message, exception);
        }
      );
    });
  };

  const handleToggleVisibility = (filename) => {
    setStlFilesVisibility(prevState => {
      const newVisibility = { ...prevState, [filename]: !prevState[filename] };

      const mesh = sceneRef.current.getMeshByName(filename);
      if (mesh) {
        mesh.isVisible = newVisibility[filename];
      }

      return newVisibility;
    });
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

  return (
    <div className="flex flex-row-reverse items-center justify-center min-h-full p-4 bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold">STL File Viewer</h1>
      <div className="space-y-2 mb-4">
        {stlFiles.map(file => (
          <div key={file.filename} className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stlFilesVisibility[file.filename]}
                onChange={() => handleToggleVisibility(file.filename)}
                className="mr-2 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-lg font-medium text-gray-700">{file.filename}</span>
            </label>
          </div>
        ))}
      </div>
      <canvas className="mx-auto border-2 border-gray-300 bg-white" style={{ width: '1000px', height: '500px' }} ref={canvasRef} />
    </div>
  );
}

export default STLViewer;