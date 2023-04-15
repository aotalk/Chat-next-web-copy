import React, { useState } from "react";
import style from "./login.module.scss";
import HomeStyle from "./home.module.scss";

import SendWhiteIcon from "../icons/send-white.svg";
import ReturnIcon from "../icons/return.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import { IconButton } from "./button";
import { isMobileScreen } from "../utils";

interface FormValues {
  email: string;
  nickName: string;
  password: string;
}

interface IRegisterProps {
  setShowModal: (_: boolean) => void;
}

// 定义组件
const Register: React.FC<IRegisterProps> = (props) => {
  // 定义表单数据的初始值
  const initialValues: FormValues = { email: "", password: "", nickName: "" };
  // 使用useState来存储表单数据
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  // 处理表单提交事件
  const handleSubmit = () => {
    // 在这里编写表单提交的相关逻辑
  };

  const renderInputs = () => {
    const formItems = [
      {
        label: "用户名",
        id: "nickName",
        name: "nickName",
        placeholder: isMobileScreen() ? "用户名" : "",
        value: formValues.nickName,
      },
      {
        label: "邮箱",
        id: "email",
        name: "email",
        placeholder: isMobileScreen() ? "邮箱" : "",
        value: formValues.email,
      },
      {
        label: "密码",
        id: "password",
        name: "password",
        placeholder: isMobileScreen() ? "密码" : "",
        value: formValues.password,
      },
    ];

    return formItems.map((item) => (
      <div className={style["form-item"]} key={item.id}>
        <label htmlFor={item.id} className={style["form-label"]}>
          {item.label}
        </label>
        <input
          type={item.id === "password" ? "password" : "text"}
          id={item.id}
          name={item.name}
          placeholder={item.placeholder}
          value={item.value}
          onChange={handleInputChange}
          className={style["form-input"]}
        />
      </div>
    ));
  };

  // 处理表单数据变化事件
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="modal-mask">
      <div className={style["login-modal"]}>
        {/* header图标 */}
        <div className={style["login-header"]}>
          <div className={HomeStyle["sidebar-header"]}>
            <div className={HomeStyle["sidebar-title"]}>ChatGPT Next</div>
            <div className={HomeStyle["sidebar-sub-title"]}>
              Build your own AI assistant.
            </div>
            <div className={HomeStyle["sidebar-logo"]}>
              <ChatGptIcon />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={style["login-form"]}>
          {/* 输入框 */}
          {renderInputs()}

          {/* 按钮组 */}
          <div className={style["form-action"]}>
            <IconButton
              icon={<SendWhiteIcon />}
              text="注册"
              bordered
              noDark
              onClick={handleSubmit}
              className={style["form-submit"]}
            />
            <IconButton
              icon={<ReturnIcon />}
              text="取消"
              bordered
              noDark
              onClick={() => {
                props.setShowModal(false);
              }}
              className={style["form-cancel"]}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
