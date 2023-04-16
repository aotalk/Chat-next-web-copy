import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import style from "./login.module.scss";
import HomeStyle from "./home.module.scss";

import SendWhiteIcon from "../icons/send-white.svg";
import ReturnIcon from "../icons/return.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import { IconButton } from "./button";
import { isMobileScreen } from "../utils";
import { IUserInfo } from "@/app/components/home";
import { AOPost, API } from "@/app/api/aotalk/route";
import { pick } from "next/dist/lib/pick";

interface FormValues {
  email: string;
  nickname: string;
  password: string;
  code: string;
}

interface IRegisterProps {
  setShowModal: (_: boolean) => void;
  onSwitch: () => void;
  onRegister: (user: IUserInfo) => void;
}

// 定义组件
const Register: React.FC<IRegisterProps> = (props) => {
  // 定义表单数据的初始值
  const initialValues: FormValues = {
    email: "",
    password: "",
    nickname: "",
    code: "",
  };
  // 使用useState来存储表单数据
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  // 处理表单提交事件
  const handleSubmit = () => {
    AOPost(API.account.register, {
      ...formValues,
    })
      .then((res: any) => {
        const data = res.data;
        if (data) {
          toast("注册并登录成功，欢迎" + data?.nickname || "", {
            autoClose: 2000,
          });
          props.onRegister({
            ...pick(data, ["email", "nickname", "session_id"]),
            password: formValues.password,
          });
          props.setShowModal(false);
        }
      })
      .catch((res) => {
        const error = res.response;
        if (error.status === 400) {
          toast("验证码不可用或邮箱已经注册", {
            type: "warning",
            autoClose: 3000,
          });
        } else {
          toast("服务器未连接或未知错误", { type: "error", autoClose: 3000 });
        }
      });
  };

  const renderInputs = () => {
    const formItems = [
      {
        label: "用户名",
        id: "nickname",
        name: "nickname",
        placeholder: isMobileScreen() ? "用户名" : "",
        value: formValues.nickname,
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
      {
        label: "验证码",
        id: "code",
        name: "code",
        placeholder: isMobileScreen() ? "验证码" : "",
        value: formValues.code,
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

        {/* 输入框 */}
        {renderInputs()}

        <div className={style["register"]}>
          已有账号?{" "}
          <span
            onClick={() => props.onSwitch()}
            className={style["register-link"]}
          >
            点击登录
          </span>
        </div>

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
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
