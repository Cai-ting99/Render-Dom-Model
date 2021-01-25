import DomBuilder from "./DomBuilder";

export interface RDMModule {
  new (): {
    Rander: () => object;
  };
}
export type DomModel = {
  Model: HTMLElement;
  AttrModel: object;
  Builder: DomBuilder;
};
