<template>
  <el-row style="margin-top: 30px;">
    <el-col :span="3" />
    <el-col :span="18">
      <el-form size="mini" label-width="120px">
        <slot></slot>
      </el-form>
    </el-col>
    <el-col :span="3" />
  </el-row>
</template>

<script>
export default { };
</script>
