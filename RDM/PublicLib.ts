/**
 * 是否是标签模型
 * @param obj 要验证的对象
 */
export function IsTagModel(obj: object) {
  return (
    typeof obj === "object" &&
    !obj.hasOwnProperty("Bind") &&
    !obj.hasOwnProperty("Prop") &&
    !Array.isArray(obj)
  );
}
/**
 * 是否是循环的Dom节点
 */
export function IsForTagModel(obj: object) {
  if (obj["f"]) return true;
  return false;
}
/**
 * 通过属性字符串获取值
 * @param PropStr 值位置字符串 例：div.a.p
 * @param model 原型对象
 */
export function GetValueByPropStr(
  PropStr: string,
  model: object,
  OutParam: boolean = false
): any {
  if (PropStr.match(/\<.*?\>/gi)) {
    PropStr = PropStr.substring(1, PropStr.length - 1);
  }
  let Prop = { key: "", Item: null };
  PropStr.split(".").forEach((s) => {
    let idx = s.match(/\[[0-9]+\]/gi);
    if (idx) {
      idx[0] = idx[0].substring(1, idx[0].length - 1);
      model = model[s.replace("[" + idx[0] + "]", "")];
      model = model[idx[0]];
      Prop.Item = model;
      Prop.key = s.replace("[" + idx[0] + "]", "");
      return;
    }
    Prop.key = s;
    Prop.Item = model;
    model = model[s];
  });
  if (OutParam) {
    return { model, Prop, BindStr: PropStr };
  }
  return model;
}
/**
 * 双向绑定
 * @param PorpStr prop位置字符串
 */
export function Bind(PorpStr): any {
  return { Bind: PorpStr };
}
