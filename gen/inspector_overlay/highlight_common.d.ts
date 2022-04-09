import type { Bounds, PathCommands, Quad } from './common.js';
export declare type PathBounds = Bounds & {
    leftmostXForY: {
        [key: string]: number;
    };
    rightmostXForY: {
        [key: string]: number;
    };
    topmostYForX: {
        [key: string]: number;
    };
    bottommostYForX: {
        [key: string]: number;
    };
};
export interface LineStyle {
    color?: string;
    pattern?: LinePattern;
}
export interface BoxStyle {
    fillColor?: string;
    hatchColor?: string;
}
export declare const enum LinePattern {
    Solid = "solid",
    Dotted = "dotted",
    Dashed = "dashed"
}
export declare function drawPathWithLineStyle(context: CanvasRenderingContext2D, path: Path2D, lineStyle?: LineStyle, lineWidth?: number): void;
export declare function fillPathWithBoxStyle(context: CanvasRenderingContext2D, path: Path2D, bounds: PathBounds, angle: number, boxStyle?: BoxStyle): void;
export declare function buildPath(commands: Array<string | number>, bounds: PathBounds, emulationScaleFactor: number): Path2D;
export declare function emptyBounds(): PathBounds;
export declare function applyMatrixToPoint(point: {
    x: number;
    y: number;
}, matrix: DOMMatrix): {
    x: number;
    y: number;
};
/**
 * Draw line hatching at a 45 degree angle for a given
 * path.
 *   __________
 *   |\  \  \ |
 *   | \  \  \|
 *   |  \  \  |
 *   |\  \  \ |
 *   **********
 */
export declare function hatchFillPath(context: CanvasRenderingContext2D, path: Path2D, bounds: Bounds, delta: number, color: string, rotationAngle: number, flipDirection: boolean | undefined): void;
/**
 * Given a quad, create the corresponding path object. This also accepts a list of quads to clip from the resulting
 * path.
 */
export declare function createPathForQuad(outerQuad: Quad, quadsToClip: Quad[], bounds: PathBounds, emulationScaleFactor: number): Path2D;
export declare function parseHexa(hexa: string): Array<number>;
export declare function formatRgba(rgba: number[], colorFormat: 'rgb' | 'hsl' | 'hwb'): string;
export declare function formatColor(hexa: string, colorFormat: string): string;
export declare function drawPath(context: CanvasRenderingContext2D, commands: PathCommands, fillColor: string | undefined, outlineColor: string | undefined, outlinePattern: LinePattern | undefined, bounds: PathBounds, emulationScaleFactor: number): Path2D;
