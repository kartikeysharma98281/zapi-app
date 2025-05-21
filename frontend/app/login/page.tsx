"use client";

import { AppBar } from "@/components/AppBar";
import { PrimaryButton } from "@/components/buttons/PrimayButton";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { useState } from "react";
import { BACKEND_URL } from "../cofig";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <AppBar />
      <div className="flex  h-screen justify-center items-center">
        <div className="flex pt-8 max-w-4xl">
          <div className="flex-1 pt-20 px-4">
            <div className="font-semibold text-3xl  pb-4">
              Join millions worldwide who automate thier work using Zapier.
            </div>
            <div className="pb-6 pt-4">
              <CheckFeature label={"Easy setup, no coding required"} />
            </div>
            <div className="pb-6">
              <CheckFeature label={"Free forever for core features"} />
            </div>
            <div className="pb-6">
              <CheckFeature label={"14-day trail of premium features & apps"} />
            </div>
          </div>
          <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
            <Input
              label={"Email"}
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Your Email"
            ></Input>
            <Input
              label={"Password"}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            ></Input>
            <div className="pt-4">
              <PrimaryButton
                onClick={async () => {
                  const res = await axios.post(
                    `${BACKEND_URL}/api/v1/user/signin`,
                    {
                      username: email,
                      password,
                    }
                  );
                  localStorage.setItem("token" , res.data.token);
                  router.push("/dashboard");
                }}
                size="big"
              >
                Login
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
