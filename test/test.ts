import { Bind, Watch } from "../RDM/PublicLib";

export default class {
  @Watch(function (nv, _ov) {
    this.data2[0] = nv;
  })
  name = "阿巴阿巴";
  data = [];
  data2 = [
    Math.random().toString(),
    Math.random().toString(),
    Math.random().toString(),
  ];
  color = "red";
  selectVal = "张三";
  EditIndex = 0;
  constructor() {
    for (let i = 0; i < 0; i++) {
      let dataName = Math.random().toString();
      this.data.push({
        name: dataName,
        age: 18,
      });
    }
  }
  Rander() {
    return {
      input: {
        if: this.data2.length !== 0,
        type: "text",
        value: Bind(`data2[${this.EditIndex}]`),
      },
      div: {
        title: `select选中的值：${this.selectVal}`,
        click: () => {
          this.name = Math.random().toString();
        },
      },
      select: {
        value: Bind("selectVal"),
        option: {
          f: this.data2,
          itemas: "m",
          title: "<m>",
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
        className: "abb",
        style: "color:" + this.color,
        title: `点我追加Dom`,
        click: () => {
          // for (let i = 0; i < 1; i++) {
          //   this.data2.push({
          //     name: "我是追加的" + Math.random(),
          //     value: "",
          //   });
          // }
          // this.data2.splice(
          //   0,
          //   0,
          //   ...[
          //     { name: "a", value: "a" },
          //     { name: "b", value: "b" },
          //   ]
          // );
        },
      },
      a: {
        title: this.name,
        div: {
          f: this.data,
          itemas: "m",
          title: "姓名：<m.name> 年龄：<m.age>",
          input: {
            value: Bind("<m.name>"),
          },
          click: () => {
            this.data.reverse();
            // this.data.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
            // this.data2.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
          },
          div: {
            title: "<m1>",
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
  Style() {
    return {};
  }
}
