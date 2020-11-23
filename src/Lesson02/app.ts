import { TypedArray } from "three";

const vertexShaderCode = `attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
}`;

const fragmentShaderCode = `precision mediump float;

varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}`;


export class WebGLApp {

    public canvas?: HTMLCanvasElement;

    public gl?: WebGLRenderingContext;

    public vertexShader: WebGLShader;

    public fragmentShader: WebGLShader;

    public program?: WebGLProgram;

    public positionBuffer?: WebGLBuffer;

    public colorBuffer?: WebGLBuffer;

    public Uniform = {

        ModelViewMatrix: 'uMVMatrix',

        ProjectionMatrix: 'uPMatrix'

    }

    private _positionAttr: number;

    private _colorAttr: number;

    public createCanvas() {

        let canvas = document.createElement( 'canvas' );
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        document.body.appendChild( canvas );
    
        this.canvas = canvas
    
        return canvas;
    
    }

    public initGL() {

        let gl = <unknown>this.canvas.getContext( 'webgl' ) as WebGLRenderingContext;
    
        if ( !gl ) {
    
            throw new Error( 'Your browser seems not support WebGL!' );
    
        }

        this.gl = gl;

        return gl;

    }

    private _compileShader( type: WebGLRenderingContextBase[ 'VERTEX_SHADER' ] | WebGLRenderingContextBase[ 'FRAGMENT_SHADER' ] , sourceCode: string ) {

        let gl = this.gl;

        let shader = gl.createShader( type );
        gl.shaderSource( shader, sourceCode );
        gl.compileShader( shader );

        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

            throw new Error( 'Could not compile shader!' );

        }

        return shader;

    }

    public compileShaders() {

        this.vertexShader = this._compileShader( this.gl.VERTEX_SHADER, vertexShaderCode );

        this.fragmentShader = this._compileShader( this.gl.FRAGMENT_SHADER, fragmentShaderCode );

    }

    public initShader() {

        let gl = this.gl;

        this.program = gl.createProgram();
        gl.attachShader( this.program, this.vertexShader );
        gl.attachShader( this.program , this.fragmentShader );
        gl.linkProgram( this.program );

        if ( !gl.getProgramParameter( this.program, gl.LINK_STATUS ) ) {

            throw new Error( 'Could not link program!' );

        }

        gl.useProgram( this.program );

        this._positionAttr = gl.getAttribLocation( this.program, "aVertexPosition" );

        this._colorAttr = gl.getAttribLocation( this.program, 'aVertexColor' );

        gl.enableVertexAttribArray( this._positionAttr );

        gl.enableVertexAttribArray( this._colorAttr );

    }

    public initBuffer( dataView: TypedArray ) {

        let gl = this.gl;

        let buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, dataView, gl.STATIC_DRAW );

        return buffer;
        
    }

    public initUniform( dataView: number[], uniformVariableName: string ) {

        let uniform = this.gl.getUniformLocation( this.program, uniformVariableName );

        this.gl.uniformMatrix4fv( uniform, false, dataView );

    }

    public beforeDraw() {

        let gl = this.gl;

        gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
        gl.enable( gl.DEPTH_TEST );

        gl.viewport( 0, 0, this.canvas.clientWidth, this.canvas.clientHeight );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    }

    public draw( mode: WebGLRenderingContextBase[ 'TRIANGLES' ] | WebGLRenderingContextBase[ 'TRIANGLE_STRIP' ] ) {

        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
        gl.vertexAttribPointer( this._positionAttr, 3, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
        gl.vertexAttribPointer( this._colorAttr, 4, gl.FLOAT, false, 0, 0 );

        let size = mode === gl.TRIANGLES ? 3 : 4

        gl.drawArrays( mode, 0, size )
        
    }

}