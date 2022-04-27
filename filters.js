let img;

let kernelGaussian = [[1/16, 2/16, 1/16], [2/16, 4/16, 2/16], [1/16, 2/16, 1/16]];
let sobelKernelX   = [[-1 , 0 , 1], [-2, 0, 2], [-1, 0, 1]];
let sobelKernelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
let kernelLapacle = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];

function preload(){
  img = loadImage('salvador.jpg')
}

function setup() {
  createCanvas(img.width+2, img.height+2);
  noLoop()
}

function draw() {
  background(0);
  image(img, 1,1)
  loadPixels();
  
  gaussianFilter();
  // let matA = sobelFilterPrep(sobelKernelX);
  // let matB = sobelFilterPrep(sobelKernelY);
  // sobelFilter(matA, matB);
  laplaceFilter();
}

function gaussianFilter(){
  //percorrer a imagem
  for (let x=1; x<301; x++){
    for (let y=1; y<301; y++){
      set(x, y, centralPx(x, y, kernelGaussian))
    }
  }
  
  updatePixels();
}

function laplaceFilter(){
    for (let x=1; x<width; x++){
      for (let y=1; y<height; y++){
        let px =  centralPx(x, y, kernelLapacle)
        set(x, y, px>15 ? 255: 0)
      }
    }
  updatePixels();
}

function centralPx(x, y, kernel){
  let p1 = get(x-1, y-1);
  let p2 = get(x-1, y);
  let p3 = get(x-1, y+1);
  let p4 = get(x, y-1);
  let p5 = get(x, y);
  let p6 = get(x, y+1);
  let p7 = get(x+1, y-1);
  let p8 = get(x+1, y);
  let p9 = get(x+1, y+1);
  
  let px = p1[0]*kernel[0][0]+p2[0]*kernel[0][1]+p3[0]*kernel[0][2]+p4[0]*kernel[1][0]+p5[0]*kernel[1][1]+p6[0]*kernel[1][2]+p7[0]*kernel[2][0]+p8[0]*kernel[2][1]+p9[0]*kernel[2][2];
  
  return px;
}

function sobelFilterPrep(sobel){
  
  let mat = []
  
  for (x=0; x<width; x++){
    let row = []
    for (y=0; y<width; y++){
      row.push(centralPx(x,y, sobel))
    }
    mat.push(row)
  }

  return mat;
}

function sobelFilter(matA, matB){
  
  let res = []
  //quadrado dos elementos da matriz
  for (let x=0; x<width; x++){
    for (let y=0; y<height; y++){
      matA[x][y] = matA[x][y]*matA[x][y]
      matB[x][y] = matB[x][y]*matB[x][y]
    }
  }
  //soma os elementos da matriz
  for (let x=0; x<width; x++){
    let row = []
    for (let y=0; y<height; y++){
      row.push(matA[x][y]+matB[x][y])
    }
    res.push(row)
  }
  //tira a raíz dos elementos da matriz
  for (let x=0; x<width; x++){
    for (let y=0; y<height; y++){
      res[x][y] = res[x][y]**(1/2)
    }
  }
  //selecionando um threshold de 80
  for (let x=0; x<width; x++){
    for (let y=0; y<height; y++){
      if (res[x][y] <= 80){
        res[x][y] = 0
      }
      else{
        res[x][y] = 255
      }
    }
  }
  
  //tira a raíz dos elementos da matriz
  for (let x=0; x<width; x++){
    for (let y=0; y<height; y++){
      set(x, y, res[x][y])
    }
  }
  
  updatePixels();
}