import { GetValueByPropStr, IsForTagModel, IsTagModel } from "./PublicLib";
import RDM from "./RDM";

export default class DomBuilder {
  HtmlElementKey: string = "";
  AttrModel: object = null;
  ParentDom: HTMLElement = null;
  DomModels: Array<DomBuilder> = [];
  Item: object = null;
  ModelProp: Array<string> = [];
  Module: { [x: string]: any; Rander: Function } = null;
  Dom: HTMLElement = null;
  IsLoad = false;
  Index = 0;
  ForLocation: any = { Action: "" };
  constructor(
    _DomModels: Array<DomBuilder>,
    _Module: { [x: string]: any; Rander: Function }
  ) {
    this.DomModels = _DomModels;
    this.Module = _Module;
    (this.ChildDomArr as any).RDMProp = true;
  }

  public setLoadState(_isLoad: boolean) {
    this.IsLoad = _isLoad;
    return this;
  }

  public setHtmlModelProp(_Props: Array<string>) {
    this.ModelProp = _Props;
    return this;
  }

  public setHtmlElementKey(_key: string) {
    this.HtmlElementKey = _key;
    return this;
  }

  public setAttrModel(Attrs: object) {
    this.AttrModel = Attrs;
    return this;
  }

  public setForItem(_item) {
    this.Item = _item;
    return this;
  }

  public setForIndex(_index) {
    this.Index = _index;
    return this;
  }

  public setParentDom(PDom) {
    this.ParentDom = PDom;
    return this;
  }

  public setContinuetoCycle(_Continue) {
    this.ContinuetoCycle = _Continue;
    return this;
  }

  public setForLocation(_location: any) {
    this.ForLocation = _location;
    return this;
  }

  public DiffAttrModel() {
    let HtmlModel = this.Module.Rander();
    let NewAttrModel = GetValueByPropStr(this.ModelProp.join("."), HtmlModel);
    let DiffAttrModel = {};
    for (const key in this.AttrModel) {
      if (
        Array.isArray(NewAttrModel[key]) ||
        typeof NewAttrModel[key] === "function"
      )
        continue;
      if (this.Item && NewAttrModel["f"]) {
        this.Item[NewAttrModel["itemas"]] = NewAttrModel["f"][this.Index];
      }
      this.AnalysisSpecificAttr(key, NewAttrModel);
      if (NewAttrModel[key].hasOwnProperty("Prop")) {
        if (
          NewAttrModel[key]["BindStr"] !== this.AttrModel[key]["BindStr"] ||
          NewAttrModel[key]["model"] !== this.AttrModel[key]["model"] ||
          NewAttrModel[key]["Prop"]["arrlen"] !==
            this.AttrModel[key]["Prop"]["arrlen"] ||
          this.Dom[key] !== NewAttrModel[key]["model"]
        ) {
          DiffAttrModel[key] = NewAttrModel[key];
          this.AttrModel[key] = NewAttrModel[key];
        }
      } else {
        if (NewAttrModel[key].toString() !== this.AttrModel[key].toString()) {
          DiffAttrModel[key] = NewAttrModel[key];
          this.AttrModel[key] = NewAttrModel[key];
        }
      }
    }
    let OldAttrModel = this.AttrModel;
    if (DiffAttrModel["if"] !== undefined) {
      DiffAttrModel = { ...this.AttrModel, ...DiffAttrModel };
    }
    this.setAttrModel(DiffAttrModel);
    this.DecorateDomAttr();
    this.setAttrModel(OldAttrModel);
  }

  private RanderIf() {
    let NewDom;
    if (this.AttrModel["if"].toString() === "false") {
      NewDom = document.createComment("") as any;
      if (this.IsLoad) {
        this.Dom.parentElement.replaceChild(NewDom, this.Dom);
      } else {
        this.Dom = NewDom;
      }
      this.ContinueTorender = false;
    } else {
      NewDom = document.createElement(
        this.HtmlElementKey.replace(/_/g, "").replace(/[0-9]/g, "")
      );
      if (this.IsLoad) {
        this.Dom.parentElement.replaceChild(NewDom, this.Dom);
      } else {
        this.Dom = NewDom;
      }
      this.ContinueTorender = true;
    }
    this.Dom = NewDom;
  }
  EventHandler;
  private RanderFunc(key: string) {
    this.Dom.removeEventListener(key, this.EventHandler);
    this.EventHandler = (...params) => {
      this.AttrModel[key](...params);
    };
    if (this.Item) {
      let _self = this;
      this.EventHandler = ((func: Function) => {
        return function (e) {
          func.apply(this, [
            _self.Item[_self.AttrModel["itemas"]],
            _self.Index,
            e,
          ]);
        };
      })(this.EventHandler);
    }
    this.Dom.addEventListener(key, this.EventHandler);
  }
  BindValueHandler;
  private RanderBind(key) {
    if (this.Dom[key] !== this.AttrModel[key].model)
      this.Dom[key] = this.AttrModel[key].model;
    let EventType = "input";
    if (this.Dom.nodeName === "SELECT") {
      EventType = "change";
    }
    this.Dom.removeEventListener(EventType, this.BindValueHandler);
    this.BindValueHandler = () => {
      this.AttrModel[key].Prop.Item[this.AttrModel[key].Prop.key] = (this
        .Dom as any).value;
    };
    this.Dom.addEventListener(EventType, this.BindValueHandler);
  }
  OldAttrStr;
  private AnalysisSpecificAttr(Attrkey: string, _AttrModel) {
    if (_AttrModel["if"] !== undefined) {
      if (_AttrModel["if"].toString() === "false") {
        return;
      }
    }
    if (_AttrModel[Attrkey].hasOwnProperty("Bind")) {
      let PropModel: any = this.Module;
      if (_AttrModel[Attrkey]["Bind"].match(/\<.*?\>/gi)) {
        PropModel = this.Item;
      }
      _AttrModel[Attrkey] = GetValueByPropStr(
        _AttrModel[Attrkey]["Bind"],
        PropModel,
        true
      );
    }
    if (typeof _AttrModel[Attrkey] === "string") {
      let ForItemas = _AttrModel[Attrkey].match(/\<.*?\>/gi);
      if (ForItemas) {
        this.OldAttrStr = _AttrModel[Attrkey];
        for (let i = 0; i < ForItemas.length; i++) {
          _AttrModel[Attrkey] = _AttrModel[Attrkey].replace(
            ForItemas[i],
            GetValueByPropStr(
              ForItemas[i].substring(1, ForItemas[i].length - 1),
              this.Item
            )
          );
        }
      }
    }
  }

  ContinueTorender = true;
  ChildDom: { [x: string]: DomBuilder } | Array<DomBuilder> = {};
  private DecorateDomAttr() {
    let BindFuncArr = [];
    (BindFuncArr as any).RDMProp = true;
    for (const key in this.AttrModel) {
      if (
        IsTagModel(this.AttrModel[key]) &&
        !this.ChildDom.hasOwnProperty(key)
      ) {
        this.ChildDom[key] = new DomBuilder(this.DomModels, this.Module)
          .setHtmlModelProp(this.ModelProp.concat(key))
          .setHtmlElementKey(key)
          .setAttrModel({ ...this.AttrModel[key] })
          .setForItem(this.Item)
          .setParentDom(this.Dom)
          .builder();
        continue;
      } else if (this.ChildDom.hasOwnProperty(key)) {
        if (Array.isArray(this.ChildDom[key])) {
          for (let i = 0; i < this.ChildDom.length; i++) {
            this.ChildDom[i]
              .setForItem(this.Item)
              .setLoadState(true)
              .builder(true);
          }
        } else {
          this.ChildDom[key]
            .setForItem(this.Item)
            .setLoadState(true)
            .builder(true);
        }
        continue;
      }
      if (!Array.isArray(this.AttrModel[key]) && key !== "itemas") {
        this.AnalysisSpecificAttr(key, this.AttrModel);
        if (key === "if") {
          this.RanderIf();
        }
        if (!this.ContinueTorender) {
          continue;
        }
        switch (key) {
          case "show":
            this.Dom.style.display =
              this.AttrModel[key].toString() === "false" ? "none" : "";
            break;
          case "style":
            this.Dom.setAttribute("style", this.AttrModel[key]);
            break;
          case "title":
            let TextDom = Array.from(this.Dom.childNodes).find(
              (m) => m.nodeName === "#text"
            );
            if (TextDom) {
              TextDom.textContent = this.AttrModel[key];
            } else {
              this.Dom.appendChild(
                document.createTextNode(this.AttrModel[key])
              );
            }
            break;
          default:
            if (typeof this.AttrModel[key] === "function") {
              this.RanderFunc(key);
            } else {
              if (this.AttrModel[key].hasOwnProperty("Prop")) {
                BindFuncArr.push(() => {
                  this.RanderBind(key);
                });
              } else {
                if (key !== "if" && key !== "f")
                  this.Dom[key] = this.AttrModel[key];
              }
            }
            break;
        }
        if (this.OldAttrStr) {
          this.AttrModel[key] = this.OldAttrStr;
          this.OldAttrStr = null;
        }
      }
    }
    for (let i = 0; i < BindFuncArr.length; i++) {
      BindFuncArr[i]();
    }
  }
  ContinuetoCycle = true;
  ChildDomArr: Array<DomBuilder> = [];
  public builder(Reconsitution: boolean = false) {
    let res = IsForTagModel(this.AttrModel);
    if (res && this.ContinuetoCycle) {
      if (!this.AttrModel["itemas"]) {
        throw new Error(
          "在 " + this.ModelProp.join(".") + " 下未找到相应的 itemas 的别名"
        );
      }
      let DomForTempLateLen = RDM.$DomForTempLate.length;
      RDM.$DomForTempLate.push({
        key: this.ModelProp.join("."),
        AttrModel: this.AttrModel,
        arr: this.AttrModel["f"],
        len: this.AttrModel["f"].length,
        action: (Type: { name: string; args: Array<any> }) => {
          Type.args = Array.from(Type.args);
          (Type.args as any).RDMProp = true;
          switch (Type.name) {
            case "unshift":
            case "push":
              if (Type.name === "unshift") {
                Type.args.reverse();
              }
              for (let i = 0; i < Type.args.length; i++) {
                this.ChildDomArr[Type.name](
                  new DomBuilder(this.DomModels, this.Module)
                    .setHtmlModelProp(this.ModelProp)
                    .setHtmlElementKey(this.HtmlElementKey)
                    .setAttrModel({ ...this.AttrModel })
                    .setContinuetoCycle(false)
                    .setForItem(
                      this.Item
                        ? {
                            ...this.Item,
                            [this.AttrModel["itemas"]]: Type.args[i],
                          }
                        : {
                            [this.AttrModel["itemas"]]: Type.args[i],
                          }
                    )
                    .setForLocation({
                      Action: Type.name,
                      ChildDomArr: this.ChildDomArr,
                    })
                    .setParentDom(this.ParentDom)
                    .builder()
                );
              }
              break;
            case "pop":
              if (this.ChildDomArr.length !== 0) {
                this.ChildDomArr[
                  this.ChildDomArr.length - 1
                ].Dom.parentElement.removeChild(
                  this.ChildDomArr[this.ChildDomArr.length - 1].Dom
                );
                this.ChildDomArr.pop();
              }
              break;
            case "shift":
              if (this.ChildDomArr.length !== 0) {
                this.ChildDomArr[0].Dom.parentElement.removeChild(
                  this.ChildDomArr[0].Dom
                );
                this.ChildDomArr.shift();
              }
              break;
            case "reverse":
            case "sort":
              for (let i = 0; i < this.ChildDomArr.length; i++) {
                this.ChildDomArr[i].Item[
                  this.AttrModel["itemas"]
                ] = this.AttrModel["f"][i];
                this.ChildDomArr[i].setLoadState(true).builder(true);
              }
              break;
            case "splice":
              let AppendDom = () => {
                Type.args.reverse();
                for (let i = 0; i < Type.args.length - 2; i++) {
                  this.ChildDomArr[Type.name](
                    Type.args[Type.args.length - 1],
                    Type.args[Type.args.length - 2],
                    new DomBuilder(this.DomModels, this.Module)
                      .setHtmlModelProp(this.ModelProp)
                      .setHtmlElementKey(this.HtmlElementKey)
                      .setAttrModel({ ...this.AttrModel })
                      .setContinuetoCycle(false)
                      .setForItem(
                        this.Item
                          ? {
                              ...this.Item,
                              [this.AttrModel["itemas"]]: Type.args[i],
                            }
                          : {
                              [this.AttrModel["itemas"]]: Type.args[i],
                            }
                      )
                      .setForLocation({
                        Action: Type.name,
                        StartIndex: Type.args[Type.args.length - 1],
                        ChildDomArr: this.ChildDomArr,
                      })
                      .setParentDom(this.ParentDom)
                      .builder()
                  );
                }
              };
              let DeleteDom = () => {
                for (let i = Type.args[0]; i < Type.args[1]; i++) {
                  this.ChildDomArr[i].Dom.parentElement.removeChild(
                    this.ChildDomArr[i].Dom
                  );
                  this.ChildDomArr.splice(i, 1);
                }
              };
              if (Type.args[1] === 0 && Type.args.length > 2) {
                AppendDom();
              } else if (Type.args[1] > 0 && Type.args.length === 2) {
                DeleteDom();
              } else if (Type.args[1] > 0 && Type.args.length > 2) {
                DeleteDom();
                AppendDom();
              }
              break;
          }
          delete (Type.args as any).RDMProp;
          if (this.ParentDom.nodeName === "SELECT") {
            (this.ParentDom as HTMLSelectElement).value = "";
          }
          for (let i = 0; i < this.ChildDomArr.length; i++) {
            this.ChildDomArr[i].Index = i;
          }
          RDM.$DomForTempLate[DomForTempLateLen].len = this.AttrModel[
            "f"
          ].length;
        },
      });
      for (let i = 0; i < this.AttrModel["f"].length; i++) {
        this.ChildDomArr.push(
          new DomBuilder(this.DomModels, this.Module)
            .setHtmlModelProp(this.ModelProp)
            .setHtmlElementKey(this.HtmlElementKey)
            .setAttrModel({ ...this.AttrModel })
            .setContinuetoCycle(false)
            .setForItem(
              this.Item
                ? {
                    ...this.Item,
                    [this.AttrModel["itemas"]]: this.AttrModel["f"][i],
                  }
                : {
                    [this.AttrModel["itemas"]]: this.AttrModel["f"][i],
                  }
            )
            .setForIndex(i)
            .setParentDom(this.ParentDom)
            .builder()
        );
      }
      return this.ChildDomArr as any;
    }

    if (!Reconsitution) {
      this.Dom = document.createElement(
        this.HtmlElementKey.replace(/_/g, "").replace(/[0-9]/g, "")
      );
    }
    this.DecorateDomAttr();
    if (this.ParentDom.nodeName !== "#comment" && !Reconsitution) {
      switch (this.ForLocation.Action) {
        case "unshift":
          if (this.ForLocation.ChildDomArr.length === 0) {
            this.ParentDom.appendChild(this.Dom);
          } else {
            this.ParentDom.insertBefore(
              this.Dom,
              this.ForLocation.ChildDomArr[0].Dom
            );
          }
          break;
        case "splice":
          if (this.ForLocation.ChildDomArr.length === 0) {
            this.ParentDom.appendChild(this.Dom);
          } else {
            this.ParentDom.insertBefore(
              this.Dom,
              this.ForLocation.ChildDomArr[this.ForLocation.StartIndex].Dom
            );
          }
          break;
        case "push":
        default:
          this.ParentDom.appendChild(this.Dom);
          break;
      }
      this.ForLocation.Action = "";
    }
    if (!Reconsitution) this.DomModels.push(this);
    return this;
  }
}
