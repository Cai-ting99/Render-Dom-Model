export interface RDMModule {
  new (): {
    Rander: () => object;
    Style: () => object;
  };
}