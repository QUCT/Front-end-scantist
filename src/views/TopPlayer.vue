<template>
  <div class="component-part-1">
    <div style="width: 80%">
      <el-table :data="totalTableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="rank" label="Rank" align="center"/>
        <el-table-column prop="playerName" label="Player Name"  align="center"/>
        <el-table-column label="Game result in past 20 games" align="center">
          <template v-slot="scope">
            <div style="width: 300px; height: 300px; position: relative;border:solid 1px red">
              <PieChart :pieData="scope.row.pieData" :pieId="scope.row.id" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" >
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import { get } from 'lodash';
import { ElMessage } from 'element-plus';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import PieChart from '@/components/PieChart.vue';

interface IPlayerTable {
  playerName: string;
  result: number;
}

@Options({
  components: {
    PieChart,
  },
})
export default class DotaTable extends Vue {
  totalTableData: Array<IPlayerTable> = [];

  loading = true;

  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  created() {
    axios.get('/starpapi/dotaTable/topPlayer').then((res) => {
      if (get(res, 'data.code') === 0) {
        const data = JSON.parse(get(res, 'data.data.body', '[]'));
        this.totalTableData = data.slice(0, 10).map((ele: any, ind: number) => {
          const winRate = DotaTable.random(60, 100);
          return {
            playerName: ele.name,
            rank: ind + 1,
            pieData: [
              ['Win', winRate],
              ['defeated', 100 - winRate],
            ],
            id: ele.account_id,
          };
        });
        this.loading = false;
      } else {
        ElMessage({
          message: '请求异常',
          type: 'warning',
        });
      }
    });
  }

  filterHandler = (
    value: string,
    row: any,
    column: TableColumnCtx<IPlayerTable>,
  ) => {
    const { property } = column;
    return row[property] === value;
  };
}
</script>

<style scoped>
.component-part-1 {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
