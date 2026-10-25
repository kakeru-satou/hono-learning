import { getTodoSchema } from "./schema.js";

// const result1 = createTodoSchema.safeParse({
//   name: "test",
// });

// const result2 = createTodoSchema.safeParse({
//   name: 123,
// });

// const result3 = createTodoSchema.safeParse({
//   name: "",
// });

// if (result1.success) {
//   console.log(result1.data.name);
// } else {
//   console.log(result1.error);
// }

// if (result2.success) {
//   console.log(result2.data.name);
// } else {
//   console.log(result2.error);
// }

// if (result3.success) {
//   console.log(result3.data.name);
// } else {
//   console.log(result3.error);
// }

const result1 = getTodoSchema.safeParse({
  id: "123",
});
const result2 = getTodoSchema.safeParse({
  id: "abc",
});
const result3 = getTodoSchema.safeParse({
  id: "1.5",
});
const result4 = getTodoSchema.safeParse({
  id: "",
});

if (result1.success) {
  console.log(result1.data.id);
} else {
  console.log(result1.error);
}
if (result2.success) {
  console.log(result2.data.id);
} else {
  console.log(result2.error);
}
if (result3.success) {
  console.log(result3.data.id);
} else {
  console.log(result3.error);
}
if (result4.success) {
  console.log(result4.data.id);
} else {
  console.log(result4.error);
}
