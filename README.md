# Point Cloud Comparison with Three.js

 This project compares the Aa River in 2018 and the Aa River in 2024.\
 The Aa river has been renaturated. In this project, you can see how the vegetation alongside the river changed!\
 It is a deliverable of the class “Unmanned Aerial Systems for Applied Research".

https://github.com/rebeca53/study-3js/assets/8900408/7d4669ad-fac5-484d-8167-866dade58110

 ## Data
 The University of Muenster provides the data. The point clouds were in .LAS and .LAZ format.
 With CloudCompare:
 - The point clouds were translated and rotated to better alignment.
 - Then, they were subsampled to 2 million points.
 - Finally, they were converted to .PCD.

 ## Getting Started
I used Three.js to render the point clouds. The implementation was based on these examples:\
[PCD Loader](https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_pcd.html)\
[Comparison Slider](https://github.com/mrdoob/three.js/blob/master/examples/webgl_multiple_scenes_comparison.html)

To get it running:
- Download the project
- Open it with Visual Studio Code
- Open the index.html
- Run the plugin Live Server
 
