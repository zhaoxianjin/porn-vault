<template>
  <v-row>
    <v-col cols="12" sm="6" class="mt-4" v-for="field in fields" :key="field._id">
      <v-subheader class="mb-2" style="height: 20px">{{ field.name }}</v-subheader>

      <div v-if="field.type == 'NUMBER'">
        <v-select
          clearable
          solo
          flat
          single-line
          :items="['equals', 'greater than', 'less than']"
          placeholder="Operation"
          hide-details
          class="mb-1"
          v-model="ops[field._id]"
          @change="emitValue"
        ></v-select>

        <v-text-field
          clearable
          style="width:100%"
          solo
          flat
          single-line
          :placeholder="field.name"
          v-model.number="values[field._id]"
          @input="emitValue"
          hide-details
          color="primary"
          :suffix="field.unit"
          :disabled="!ops[field._id]"
        />
      </div>

      <div v-if="field.type == 'STRING'">
        <v-select
          solo
          flat
          single-line
          clearable
          :items="['equals', 'contains']"
          placeholder="Operation"
          hide-details
          class="mb-1"
          v-model="ops[field._id]"
          @change="emitValue"
        ></v-select>

        <v-text-field
          clearable
          style="width:100%"
          solo
          flat
          single-line
          :placeholder="field.name"
          v-model="values[field._id]"
          @input="emitValue"
          hide-details
          color="primary"
          :suffix="field.unit"
          :disabled="!ops[field._id]"
        />
      </div>

      <div v-if="field.type == 'SINGLE_SELECT'">
        <v-select
          solo
          flat
          single-line
          clearable
          :items="['equals']"
          placeholder="Operation"
          hide-details
          class="mb-1"
          v-model="ops[field._id]"
          @change="emitValue"
        ></v-select>

        <v-select
          clearable
          style="width:100%"
          solo
          flat
          single-line
          color="primary"
          :placeholder="field.name"
          v-model="values[field._id]"
          :items="field.values"
          @change="emitValue"
          hide-details
          :suffix="field.unit"
          :disabled="!ops[field._id]"
        />
      </div>

      <div v-if="field.type == 'MULTI_SELECT'">
        <v-select
          hide-details
          class="mb-1"
          solo
          flat
          single-line
          clearable
          :items="['contains']"
          placeholder="Operation"
          v-model="ops[field._id]"
          @change="emitValue"
        ></v-select>

        <v-select
          clearable
          style="width:100%"
          solo
          flat
          single-line
          color="primary"
          :placeholder="field.name"
          v-model="values[field._id]"
          :items="field.values"
          @change="emitValue"
          hide-details
          :suffix="field.unit"
          :disabled="!ops[field._id]"
        />
      </div>

      <div v-if="field.type == 'BOOLEAN'">
        <v-select
          hide-details
          class="mb-1"
          solo
          flat
          single-line
          clearable
          :items="['equals']"
          placeholder="Operation"
          v-model="ops[field._id]"
          @change="emitValue"
        ></v-select>

        <v-checkbox
          class="mt-0"
          v-model="values[field._id]"
          @change="emitValue"
          color="primary"
          hide-details
          :label="values[field._id]===true ? 'Yes' : 'No'"
          :disabled="!ops[field._id]"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import ApolloClient, { serverBase } from "../apollo";
import gql from "graphql-tag";

@Component
export default class CustomFieldSelector extends Vue {
  @Prop({ default: () => [] }) value!: any[];
  @Prop() fields!: any;
  @Prop({ default: () => ({}) }) values!: Record<string, any>;
  @Prop({ default: () => ({}) }) ops!: Record<string, any>;

  innerValue = [] as { id: string; op: string; value: any }[];

  beforeMount() {
    this.innerValue = JSON.parse(JSON.stringify(this.value));
    for (const obj of this.innerValue) {
      this.values[obj.id] = obj.value;
      this.ops[obj.id] = obj.op;
    }
  }

  @Watch("value", { deep: true })
  onValueChange(newVal: any) {
    this.innerValue = newVal;
  }

  emitValue(newVal: any) {
    this.innerValue = [];
    for (const id in this.values) {
      const value = this.values[id];
      const op = this.ops[id];
      if (value && op) {
        this.innerValue.push({
          id,
          op,
          value
        });
      }
    }
    this.$emit("input", this.innerValue);
    this.$emit("change");
  }
}
</script>

<style lang="scss" scoped>
</style>