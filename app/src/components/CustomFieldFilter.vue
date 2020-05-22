<template>
  <div>
    <v-row>
      <v-col v-for="(filter, i) in innerValue" :key="i" cols="12" sm="6">
        <v-card outlined class="mb-2 subtitle-1">
          <v-card-title class="d-flex align-center">
            {{ getField(filter.id).name }}
            <v-spacer></v-spacer>
            <v-btn icon @click="splice(i)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="getField(filter.id).type == 'NUMBER'">
              <v-select
                clearable
                solo
                flat
                single-line
                :items="['equals', 'greater than', 'less than']"
                placeholder="Operation"
                hide-details
                class="mb-1"
                v-model="innerValue[i].op"
                @change="emitValue"
              ></v-select>

              <v-text-field
                clearable
                style="width:100%"
                solo
                flat
                single-line
                :placeholder="getField(filter.id).name"
                v-model.number="innerValue[i].value"
                @input="emitValue"
                hide-details
                color="primary"
                :suffix="getField(filter.id).unit"
              />
            </div>
            <div v-else-if="getField(filter.id).type == 'STRING'">
              <v-select
                solo
                flat
                single-line
                clearable
                :items="['equals', 'contains']"
                placeholder="Operation"
                hide-details
                class="mb-1"
                v-model="innerValue[i].op"
                @change="emitValue"
              ></v-select>

              <v-text-field
                clearable
                style="width:100%"
                solo
                flat
                single-line
                :placeholder="getField(filter.id).name"
                v-model="innerValue[i].value"
                @input="emitValue"
                hide-details
                color="primary"
                :suffix="getField(filter.id).unit"
              />
            </div>
            <div v-if="getField(filter.id).type == 'SINGLE_SELECT'">
              <v-select
                solo
                flat
                single-line
                clearable
                :items="['equals']"
                placeholder="Operation"
                hide-details
                class="mb-1"
                v-model="innerValue[i].op"
                @change="emitValue"
              ></v-select>

              <v-select
                clearable
                style="width:100%"
                solo
                flat
                single-line
                color="primary"
                :placeholder="getField(filter.id).name"
                v-model="innerValue[i].value"
                :items="getField(filter.id).values"
                @change="emitValue"
                hide-details
                :suffix="getField(filter.id).unit"
              />
            </div>
            <div v-else-if="getField(filter.id).type == 'MULTI_SELECT'">
              <v-select
                hide-details
                class="mb-1"
                solo
                flat
                single-line
                clearable
                :items="['contains']"
                placeholder="Operation"
                v-model="innerValue[i].op"
                @change="emitValue"
              ></v-select>

              <v-select
                clearable
                style="width:100%"
                solo
                flat
                single-line
                color="primary"
                :placeholder="getField(filter.id).name"
                v-model="innerValue[i].value"
                :items="getField(filter.id).values"
                @change="emitValue"
                hide-details
                :suffix="getField(filter.id).unit"
              />
            </div>
            <div v-else-if="getField(filter.id).type == 'BOOLEAN'">
              <v-select
                hide-details
                class="mb-1"
                solo
                flat
                single-line
                clearable
                :items="['equals']"
                placeholder="Operation"
                v-model="innerValue[i].op"
                @change="emitValue"
              ></v-select>

              <v-checkbox
                class="mt-0"
                v-model="innerValue[i].value"
                @change="emitValue"
                color="primary"
                hide-details
                :label="innerValue[i].value === true ? 'Yes' : 'No'"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="d-flex text-center">
      <v-select
        v-model="selectedFieldId"
        solo
        single-line
        flat
        placeholder="Select custom field"
        :items="fields"
        item-text="name"
        item-value="_id"
      ></v-select>
      <v-btn text @click="addFilter" class="mt-3 text-none" color="primary">Add filter</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import ApolloClient, { serverBase } from "../apollo";
import gql from "graphql-tag";

@Component
export default class CustomFieldSelector extends Vue {
  @Prop({ default: () => [] }) value!: { id: string; op: string; value: any }[];
  @Prop() fields!: any[];

  innerValue = [] as { id: string; op: string; value: any }[];
  selectedFieldId = null as string | null;

  getField(id: string) {
    return this.fields.find(f => f._id == id);
  }

  beforeMount() {
    this.innerValue = JSON.parse(JSON.stringify(this.value));
  }

  addFilter() {
    if (!this.selectedFieldId) return;
    this.innerValue.push(<any>{
      id: this.selectedFieldId
    });
  }

  splice(index: number) {
    this.innerValue.splice(index, 1);
    this.emitValue();
  }

  @Watch("value", { deep: true })
  onValueChange(newVal: any) {
    this.innerValue = newVal;
  }

  emitValue() {
    this.$emit("input", JSON.parse(JSON.stringify(this.innerValue)));
    this.$emit("change");
  }
}
</script>

<style lang="scss" scoped>
</style>