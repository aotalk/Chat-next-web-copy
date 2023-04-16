import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "./login.module.scss";
import HomeStyle from "./home.module.scss";

import SendWhiteIcon from "../icons/send-white.svg";
import ReturnIcon from "../icons/return.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import DeleteIcon from "../icons/delete.svg";

import { IconButton } from "./button";
import { isMobileScreen } from "../utils";
import { AOPost, API } from "@/app/api/aotalk/route";
import { AuthContext, IUserInfo } from "./home";
import { pick } from "next/dist/lib/pick";

interface FormValues {
  email: string;
  password: string;
}

interface ILoginProps {
  setShowModal: (_: boolean) => void;
  onSwitch: () => void;
  onLogin: (user: IUserInfo | null) => void;
}

export function login(postValues: any) {
  return new Promise<IUserInfo>((resolve, reject) => {
    AOPost(API.account.login, {
      ...postValues,
    })
      .then((res: any) => {
        const data = res.data;
        resolve({
          ...pick(data, ["email", "nickname", "session_id"]),
          password: postValues.password,
        });
      })
      .catch((res) => {
        const error = res.response;
        reject(error);
      });
  });
}

// 定义组件
const Login: React.FC<ILoginProps> = (props) => {
  // 定义表单数据的初始值
  const initialValues: FormValues = { email: "", password: "" };
  // 使用useState来存储表单数据
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const loginInfo = useContext(AuthContext);

  if (loginInfo) {
    return (
      <div className="modal-mask">
        <div className={style["logout"]}>
          <div className={style["logout-desc"]}>是否退出登录?</div>
          <div className={style["logout-btn"]}>
            <IconButton
              icon={<DeleteIcon />}
              text="确认"
              bordered
              noDark
              onClick={() => {
                toast("退出成功", { autoClose: 2000 });
                props.onLogin(null);
                props.setShowModal(false);
              }}
              className={style["form-cancel"]}
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
      </div>
    );
  }
  // 处理表单提交事件
  const handleSubmit = () => {
    login(formValues)
      .then((userInfo) => {
        if (userInfo) {
          toast("登录成功，欢迎" + userInfo.nickname || "", {
            autoClose: 2000,
          });
          props.onLogin(userInfo);
          props.setShowModal(false);
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          toast("请输入正确的邮箱或密码", { type: "warning", autoClose: 3000 });
        } else {
          toast("服务器未连接或未知错误", { type: "error", autoClose: 3000 });
        }
      });
  };

  // 处理表单数据变化事件
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const renderInputs = () => {
    const formItems = [
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

  return (
    <div className="modal-mask">
      <div className={style["login-modal"]}>
        {/*logo*/}
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

        {renderInputs()}

        <div className={style["register"]}>
          没有账号?{" "}
          <span
            onClick={() => props.onSwitch()}
            className={style["register-link"]}
          >
            点击注册
          </span>
        </div>

        <div className={style["form-action"]}>
          <IconButton
            icon={<SendWhiteIcon />}
            text="登录"
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

export default Login;
