import { mount } from '@vue/test-utils';
import DotaTable from '@/views/DotaTable.vue';

describe('Heros.vue', () => {
  it('测试筛选功能', () => {
    // 将组件渲染出来
    const wrapper = mount(DotaTable);

    // 给英雄名赋值
    wrapper.setData({
      herosName: 'Axe',
    });

    // 触发按钮点击事件
    wrapper.find('.filter-input').trigger('keyup.enter');

    // 断言
    expect(wrapper.vm.tableData).toEqual([]);
  });
});
