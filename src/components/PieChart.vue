<template>
  <div class="d3-content" :id="'d3-' + pieId"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    pieData: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [
        ['Win', 72.5],
        ['defeated', 5.3],
      ],
    },
    pieId: {
      type: String,
    },
  },
  mounted() {
    this.setSvg();
  },
  methods: {
    setSvg() {
      const width = 300; // 画布的宽度
      const height = 300; // 画布的高度

      const dataset = this.pieData; // 数据

      const pie = d3
        .pie()
        .sort(null)
        .value((d) => d[1]);
      const piedata = pie(dataset);

      const outerRadius = width / 4; // 圆环起始半径
      const innerRadius = 0; // 圆环结束半径;

      const arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);

      const colors = d3.schemeCategory10; // 定义颜色

      const svg = d3
        .select(`#d3-${this.pieId}`) // 选择元素
        .append('svg') // 添加一个svg元素
        .attr('width', width) // 设定宽度
        .attr('height', height); // 设定高度

      // 填充路径
      const arcs = svg
        .selectAll('g')
        .data(piedata)
        .enter()
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      // 添加颜色
      arcs
        .append('path')
        .attr('fill', (d, i) => colors[i])
        .attr('d', (d) => arc(d));

      // 添加文字
      arcs
        .append('text')
        .attr('transform', (d, i) => {
          const x = arc.centroid(d)[0] * 2.8;
          const y = arc.centroid(d)[1] * 2.8;
          if (i === 4) {
            return `translate(${x * 1.2}, ${y * 1.2})`;
          }
          if (i === 3) {
            return `translate(${x - 40}, ${y})`;
          }
          if (i === 5) {
            return `translate(${x + 40}, ${y})`;
          }
          return `translate(${x}, ${y})`;
        })
        .attr('text-anchor', 'middle')
        .text((d) => {
          const percent = (Number(d.value) / d3.sum(dataset, (d1) => d1[1])) * 100;
          return `${d.data[0]} ${percent.toFixed(1)}%`;
        });

      // 添加指示线
      arcs
        .append('line')
        .attr('stroke', 'black')
        .attr('x1', (d) => arc.centroid(d)[0] * 2)
        .attr('y1', (d) => arc.centroid(d)[1] * 2)
        .attr('x2', (d, i) => {
          if (i === 4) {
            return arc.centroid(d)[0] * 3.2;
          }
          return arc.centroid(d)[0] * 2.5;
        })
        .attr('y2', (d, i) => {
          if (i === 4) {
            return arc.centroid(d)[1] * 3.2;
          }
          return arc.centroid(d)[1] * 2.5;
        });

      // 饼图结束
    },
  },
};
</script>

<style scoped>
.d3-content {
  position: absolute;
  top: 30px;
  left: 20px;
}
</style>
