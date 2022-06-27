import * as React from "react";
import { useDataRef } from "rjv-react";
import { Form, Input, Selector, Button } from "antd-mobile";

type BackProps = {
  onBack: (data: any) => void;
};

function BackBtn({ onBack }: BackProps) {
  const dataRef = useDataRef("/");

  return <Button onClick={() => onBack(dataRef.value)}>Back</Button>;
}

type Props = BackProps & {
  data: any;
  onSuccess: (data: any) => void;
};

export default function Step2Form({ data, onSuccess, onBack }: Props) {
  return (
    <Form onFinish={onSuccess} data={data}>
      <Input type="text" label="Full Name" />

      <Form.Item>
        <BackBtn onBack={onBack} />
        &nbsp;
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
