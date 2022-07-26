/**
 * 数值 支持查询条件（等于 大于 小于 大于等于 小于等于 区间）
**/

const NUMBER_QUERY_TYPE = ['EQ', 'NE', 'GT', 'GE', 'LT', 'LE', 'BETWEEN']
const VARCHAR_QUERY_TYPE = ['LIKE', 'LIKE_LEFT', 'LIKE_RIGHT', 'EQ']
export const columnTypeList = [
  {label:'varchar',value:'varchar', type: 'input', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'bit',value:'bit', type: 'switch', isSearch: true, isSenior: false, isEnum: false},
  {label:'char',value:'char',type: 'input', isSearch: false, isSenior: false, isEnum: false},
  {label:'tinyblob',value:'tinyblob', type: 'textarea', isSearch: false, isSenior: false, isEnum: false},
  {label:'tinytext',value:'tinytext', type: 'textarea', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'text',value:'text', type: 'textarea', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'mediumblob',value:'mediumblob', type: 'textarea', isSearch: false, isSenior: false, isEnum: false},
  {label:'longblob',value:'longblob', type: 'textarea', isSearch: false, isSenior: false, isEnum: false},
  {label:'longtext',value:'longtext', type: 'textarea', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'tinyint',value:'tinyint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'smallint',value:'smallint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'mediumint',value:'mediumint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'int',value:'int', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'integer',value:'integer', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'year',value:'year', type: 'datePicker', datetype: 'year', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'bigint',value:'bigint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'float',value:'float', type: 'inputNumber', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'double',value:'double', type: 'inputNumber', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'decimal',value:'decimal', type: 'inputNumber', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'date',value:'date', type: 'datePicker', datetype: 'date', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'time',value:'time', type: 'timePicker', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'datetime',value:'datetime', type: 'datePicker', datetype: 'datetime', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'timestamp',value:'timestamp', type: 'datePicker', datetype: 'datetime', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'enum',value:'enum', type: '', isSearch: true, isSenior: true, isEnum: true, limit: ['EQ']},
]