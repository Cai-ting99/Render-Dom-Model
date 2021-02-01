import { Bind } from "../RDM/PublicLib";

export default class {
  name = "原文本";
  data = [];
  data2 = [
    { name: Math.random().toString(), value: "a" },
    { name: Math.random().toString(), value: "b" },
    { name: Math.random().toString(), value: "c" },
  ];
  color = "red";
  selectVal = "张三";
  EditIndex = 0;
  constructor() {
    for (let i = 0; i < 1000; i++) {
      let dataName = Math.random().toString();
      this.data.push({
        name: dataName,
        age: 18,
        if: parseFloat(dataName) > 0.5,
      });
    }
  }
  Rander() {
    return {
      input: {
        if: this.data2.length !== 0,
        type: "text",
        value: Bind(`data2[${this.EditIndex}].name`),
      },
      div: {
        title: `select选中的值：${this.selectVal}`,
      },
      select: {
        value: Bind("selectVal"),
        option: {
          f: this.data2,
          itemas: "m",
          title: "<m.name>",
          value: "<m.value>",
        },
      },
      button: {
        title: "test",
        click: () => {
          this.data.unshift(
            ...[
              {
                name: "我是unshift的" + Math.random(),
                age: 18,
              },
              {
                name: "我是unshift的" + Math.random(),
                age: 18,
              },
            ]
          );
        },
      },
      div1: {
        style: "color:" + this.color,
        title: `点我追加Dom`,
        click: () => {
          this.data2.push({
            name: "我是追加的" + Math.random(),
            value: Math.random().toString(),
          });
        },
      },
      a: {
        title: this.name,
        div: {
          if: "<m.if>",
          f: this.data,
          itemas: "m",
          title: "姓名：<m.name> 年龄：<m.age>",
          input: {
            value: Bind("<m.name>"),
            click: (_m, _i, e: Event) => {
              e.stopPropagation();
            },
          },
          click: () => {
            // this.data.reverse();
            this.data.forEach((m) => {
              if (m.if) {
                m.if = false;
              } else {
                m.if = true;
              }
            });
          },
          div: {
            title: "<m1.name>",
            f: this.data2,
            itemas: "m1",
            click: (_m, i, e: Event) => {
              this.EditIndex = i;
              e.stopPropagation();
            },
          },
        },
      },
    };
  }
}
