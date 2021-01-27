import DomBuilder from "./DomBuilder";
import { RDMModule } from "./Type";

export default class RDM {
  /**模块对象 */
  $Module: { Rander: Function; Style: Function; [x: string]: any };

  $BackModule = {};

  /**Dom对象实体的集合 */
  $DomModels: Array<DomBuilder> = [];

  /**根节点碎片 */
  $Document: HTMLElement = document.createDocumentFragment() as any;

  static $DomForTempLate: Array<{
    key: string;
    AttrModel: object;
    arr: Array<any>;
    len: number;
    action: Function;
  }> = [];

  static $WatchFuncList: Array<{ key: string; func: Function }> = [];
  /**
   * RDM构造函数
   * @param Module 模块类
   */
  constructor(Module: RDMModule) {
    this.$Module = new Module();
    this.RanderCssStyle(this.$Module.Style());
    this.RanderHTMLModel(this.$Module.Rander(), this.$Document);
    setTimeout(() => {
      this.Monitor(this.$Module);
      for (const key in this.$Module) {
        this.$BackModule[key] = this.$Module[key];
      }
      this.RewritingArrayFunc();
    }, 0);
    document.body.appendChild(this.$Document);
  }

  LazyUpdate: any = 0;
  AopFunc(Func: Function): any {
    let _self = this;
    return function () {
      Func.apply(this, arguments);
      if (this.RDMProp) return;
      if (
        Func.name === "reverse" ||
        Func.name === "sort" ||
        Func.name === "splice"
      )
        this["$__" + Func.name] = true;
      _self.Monitor(_self.$Module);
      for (let i = 0; i < RDM.$DomForTempLate.length; i++) {
        if (
          RDM.$DomForTempLate[i].arr.length !== RDM.$DomForTempLate[i].len ||
          (RDM.$DomForTempLate[i].arr as any)["$__" + Func.name]
        ) {
          RDM.$DomForTempLate[i].action({ name: Func.name, args: arguments });
        }
      }
      if (
        Func.name === "reverse" ||
        Func.name === "sort" ||
        Func.name === "splice"
      )
        delete this["$__" + Func.name];
      if (_self.LazyUpdate) {
        clearTimeout(_self.LazyUpdate);
      }
      _self.LazyUpdate = setTimeout(() => {
        for (let i = 0; i < _self.$DomModels.length; i++) {
          _self.$DomModels[i].setLoadState(true).DiffAttrModel();
        }
      }, 1);
    };
  }

  RewritingArrayFunc() {
    (this.$DomModels as any).RDMProp = true;
    let FuncName = [
      "push",
      "pop",
      "shift",
      "unshift",
      "sort",
      "reverse",
      "splice",
    ];
    for (let i = 0; i < FuncName.length; i++) {
      Array.prototype[FuncName[i]] = this.AopFunc(Array.prototype[FuncName[i]]);
    }
  }

  LaterUpadte: any = 0;

  Monitor(Model: object, ParentKey: Array<string> = []) {
    let MonitorModel = (key) => {
      let TempValue = Model[key];
      Object.defineProperty(Model, key, {
        get: () => {
          return TempValue;
        },
        set: (v) => {
          let FuncK = key;
          if (ParentKey.length !== 0) FuncK = ParentKey[0];
          let WatchFunc = RDM.$WatchFuncList.find((f) => f.key === FuncK);
          TempValue = v;
          WatchFunc &&
            WatchFunc.func.apply(this, [
              this.$Module[FuncK],
              this.$BackModule[FuncK],
              FuncK,
            ]);
          if (this.LaterUpadte) {
            clearTimeout(this.LaterUpadte);
          }
          this.LaterUpadte = setTimeout(() => {
            for (let i = 0; i < this.$DomModels.length; i++) {
              this.$DomModels[i].setLoadState(true).DiffAttrModel();
            }
          }, 1);
        },
      });
      if (typeof Model[key] === "object") {
        this.Monitor(Model[key], ParentKey.concat(key));
      }
    };
    if (Array.isArray(Model)) {
      for (let i = 0; i < Model.length; i++) {
        if (typeof Model[i] === "object") {
          this.Monitor(Model[i], ParentKey.concat(i.toString()));
        } else {
          MonitorModel(i);
        }
      }
      return;
    }
    for (const key in Model) {
      MonitorModel(key);
    }
  }

  RanderCssStyle(_StyleStr: string) {
    // var ele = document.createElement("div");
    // ele.innerHTML = `<style>${StyleStr}</style>`;
    // document.getElementsByTagName("head")[0].appendChild(ele.firstElementChild);
  }

  RanderHTMLModel(HTMLModel: object, ParentDom: HTMLElement) {
    for (const key in HTMLModel) {
      new DomBuilder(this.$DomModels, this.$Module)
        .setHtmlModelProp([key])
        .setHtmlElementKey(key)
        .setAttrModel(HTMLModel[key])
        .setParentDom(ParentDom)
        .builder();
    }
  }
}
(RDM.$DomForTempLate as any).RDMProp = true;
