<template>
  <div>
    <el-select class="province" placeholder="请选择省份" @change="getcity" v-model="address.province">
      <el-option v-for="item in provinceColumn" :label="item.p" :value="item.p"></el-option>
    </el-select>
    <el-select class="city" placeholder="请选择市" @change="getarea" v-model="address.city">
      <el-option v-for="item in cityColumn" :label="item.n" :value="item.n"></el-option>
    </el-select>
    <el-select class="area" placeholder="请选择区" v-model="address.area">
      <el-option v-for="item in areaColumn" :label="item.s" :value="item.s"></el-option>
    </el-select>
  </div>
</template>

<script>
import city from '../../../static/city.json'

export default {
  name: 'CascadeAddress',
  props: {
    address: {
      type: Object,
      default: {}
    },
    cityColumn: {
      type: Array,
      default: []
    },
    areaColumn: {
      type: Array,
      default: []
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      provinceColumn: [],
      innerEditing: null
    }
  },
  created() {
    this.innerEditing = this.editing
    this.provinceColumn = city.citylist
    console.log('children created')
  },
  mounted() {
    console.log('children mounted')
  },
  methods: {
    getcity() {
      city.citylist.forEach((item) => {
        if (item.p === this.address.province) {
          this.cityColumn = item.c
        }
      })
      this.address.city = ''
      this.address.area = ''
    },
    getarea() {
      this.cityColumn.forEach((item) => {
        if (item.n === this.address.city) {
          this.areaColumn = item.a
        }
      })
      this.address.area = ''
    }
  }
}
</script>
