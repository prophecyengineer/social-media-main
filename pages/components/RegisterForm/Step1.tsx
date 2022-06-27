import * as React from "react";
import { Form, Input, Button } from "antd-mobile";

type Props = {
  data: any;
  onSuccess: (data: any) => void;
};

export default function Step1Form({ data, onSuccess }: Props) {
  return (
    <Form
      onFinish={onSuccess}
      data={data}
      autoComplete="off"
      layout="horizontal"
    >
      <Input
        path="first"
        schema={{ default: "", presence: true }}
        label="First Name"
      />
      <Input
        path="last"
        schema={{ default: "", presence: true }}
        label="Last Name"
      />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </Form.Item>
    </Form>
  );
}
