<template>
  <el-row style="margin-top: 30px;">
    <el-col :span="2"><div class="grid-content"></div></el-col>
    <el-col :span="20">
      <el-form size="mini" label-width="120px">
        <slot></slot>
      </el-form>
    </el-col>
    <el-col :span="2"><div class="grid-content"></div></el-col>
  </el-row>
</template>

<script>
export default {};
</script>

<style scoped>
.grid-content {
  min-height: 36px;
}
</style>
