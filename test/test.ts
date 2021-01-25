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
      });
    }
    this.data2[0].name = "前缀";
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
          // for (let i = 0; i < 1; i++) {
          //   this.data2.push({
          //     name: "我是追加的" + Math.random(),
          //     value: "",
          //   });
          // }
          // this.data2.pop();
          this.data2.push({
            name: "我是追加的" + Math.random(),
            value: Math.random().toString(),
          });
        },
      },
      a: {
        title: this.name,
        div: {
          f: this.data,
          itemas: "m",
          title: this.data2[0].name + "：<m.name> 年龄：<m.age>",
          input: {
            value: Bind("<m.name>"),
          },
          click: () => {
            this.data.reverse();
            // this.data.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
            // this.data2.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
          },
          div: {
            title: "<m1.name>",
            f: this.data2,
            itemas: "m1",
            click: (_m, i) => {
              this.EditIndex = i;
            },
          },
        },
      },
    };
  }
}
