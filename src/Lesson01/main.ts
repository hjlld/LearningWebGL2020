import { Matrix4, PerspectiveCamera } from 'three';
import { WebGLApp } from './app';

const triangle = {

    vertices:  new Float32Array( [
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ] ),

    matrix: new Matrix4().makeTranslation( -1.5, 0.0, -7.0 ),

    indices: new Uint32Array( [ 0, 1, 2 ] )

}

const square = {

    vertices: new Float32Array( [
        1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ] ),

    matrix: new Matrix4().makeTranslation( 1.5, 0.0, -7.0 ),

    indices: new Uint32Array( [ 0, 1, 2, 1, 2, 3 ] )

}

const main = () => {

    let camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );

    let pMatrix = camera.projectionMatrix;

    let app = new WebGLApp();

    app.createCanvas();

    app.initGL();

    app.compileShaders();

    app.initShader();

    app.beforeDraw();

    app.initBuffer( triangle.vertices );
    app.initUniform( triangle.matrix.toArray(), app.Uniform.ModelViewMatrix );
    app.initUniform( pMatrix.toArray(), app.Uniform.ProjectionMatrix );
    
    app.draw( app.gl.TRIANGLES );

    app.initBuffer( square.vertices );
    app.initUniform( square.matrix.toArray(), app.Uniform.ModelViewMatrix );
    app.initUniform( pMatrix.toArray(), app.Uniform.ProjectionMatrix );

    app.draw( app.gl.TRIANGLE_STRIP )

}

window.addEventListener( 'DOMContentLoaded', main );