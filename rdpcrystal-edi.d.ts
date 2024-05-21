declare module "rdpcrystal-edi-library" {
  export class EDILightWeightDocument {
    Delimiters: {
      ElementTerminatorCharacter: number;
      CompositeTerminatorCharacter: number;
      SegmentTerminatorCharacter: number;
    };
    AutoPlaceCorrectNumOfSegments: boolean;
    EachSegmentInNewLine: boolean;
    createLoop(loopName: string): EDILoop;
    generateEDIData(): string;
  }

  export class EDILoop {
    createSegment(segmentName: string): EDISegment;
    createLoop(loopName: string): EDILoop;
  }

  export class EDISegment {
    addElement(element: string): void;
    elements: EDIElementCollection;
  }

  export class EDIElementCollection {
    add(element: EDIElement): void;
  }

  export class EDIElement {
    addCompositeElement(element: string): void;
  }

  export class LightWeightElement extends EDIElement {}
}
