export default class DomAttrBuilder {
  AttrModel = {};
  IsLoad = false;
  FakeDom: HTMLElement;
  Dom: HTMLElement;
  ParentDom: HTMLElement;
  constructor(_ParentDom: HTMLElement, _Dom: HTMLElement) {
    this.ParentDom = _ParentDom;
    this.Dom = _Dom;
  }

  public setAttrModel(_AttrModel) {
    this.AttrModel = _AttrModel;
  }
  public setIsLoad(_isLoad) {
    this.IsLoad = _isLoad;
  }

  private RanderIf() {
    if (this.AttrModel.hasOwnProperty("if")) {
      //   this.AnalysisSpecificAttr("if", this.AttrModel);
      let RestoreValue;
      if (this.AttrModel["if"]["template"]) {
        let OldV = this.AttrModel["if"];
        RestoreValue = () => {
          this.AttrModel["if"] = OldV;
        };
        this.AttrModel["if"] = this.AttrModel["if"]["value"];
      }
      if (this.AttrModel["if"].toString() === "false") {
        if (this.FakeDom) return;
        this.FakeDom = document.createComment("") as any;
        if (this.IsLoad) {
          this.ParentDom.replaceChild(this.FakeDom, this.Dom);
        }
      } else if (this.AttrModel["if"].toString() === "true") {
        if (!this.FakeDom) return;
        // let NewDom = document.createElement(
        //   this.HtmlElementKey.replace(/_/g, "").replace(/[0-9]/g, "")
        // );
        if (this.IsLoad) {
          this.ParentDom.replaceChild(this.Dom, this.FakeDom);
          this.FakeDom = null;
        }
      }
      RestoreValue && RestoreValue();
    }
  }

  public DecorateDomAttr() {
    this.RanderIf();
  }
}
