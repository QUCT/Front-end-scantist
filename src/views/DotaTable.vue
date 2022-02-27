<template>
  <div class="component-part-1">
    <div style="width: 80%">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="img" label="Hero Image" sortable>
          <template #default="scope">
            <img
              :src="scope.row.img"
              alt=""
              style="width: 40px; height: 40px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Hero Name"
          :filters="[{ text: 'npc_dota_hero_axe', value: 'npc_dota_hero_axe' }]"
          sortable
          :filter-method="filterHandler"
        />
        <el-table-column prop="proWin" label="PRO Win Rate" sortable />
        <el-table-column prop="proPick" label="Pro Pick Count" sortable />
        <el-table-column prop="proBan" label="Pro Ban Count" sortable />
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalPage"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" >
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import { get } from 'lodash';
import { ElMessage } from 'element-plus';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';

interface IdotaTable {
  img: string;
  proWin: string;
  proPick: string;
  proBan: string;
}

@Options({})
export default class DotaTable extends Vue {
  tableData: Array<IdotaTable> = [];

  totalTableData: Array<IdotaTable> = [];

  totalPage = 0;

  pageSize = 5;

  loading = true;

  currentChange(params: number) {
    this.tableData = this.totalTableData.slice((params - 1) * 5, params * 5);
  }

  created() {
    const url = process.env.NODE_ENV === 'development' ? '/starpapi/dotaTable/rateList' : 'http://localhost:8082/dotaTable/rateList';
    axios.get(url).then((res) => {
      if (get(res, 'data.code') === 0) {
        const data = JSON.parse(get(res, 'data.data.body', '[]'));
        this.totalPage = data?.length;
        this.totalTableData = data.map((ele: any) => ({
          img: `https://api.opendota.com${ele.img}`,
          name: ele.name,
          proWin: ele.pro_win,
          proPick: ele.pro_pick,
          proBan: ele.pro_ban,
        }));
        this.tableData = this.totalTableData.slice(0, 5);
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
    column: TableColumnCtx<IdotaTable>,
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
