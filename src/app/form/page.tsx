"use client";

import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import client from "../axios.config";
import Footer from "../../components/footer/page";
import Header from "../../components/header/page";
import { useRouter } from "next/navigation";

const Form = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      registerNumber: "",
      checkAmount: "",
      dealerName: "",
      userName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const submitForm: any = await client.post(`/api/form`, { ...data });
      toast.success(submitForm?.message);
      reset();
      router.push("/tableStatus");
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center m-20 min-h-[65vh]">
        <div className=" w-full max-w-lg  p-4 rounded-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Register Number
              </label>

              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder=""
                {...register("registerNumber", { required: "Required" })}
              />
              {errors.registerNumber?.message && (
                <p className="text-red-500 text-xs italic">
                  {errors.registerNumber?.message}
                </p>
              )}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Check Amount
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder=""
                {...register("checkAmount", { required: "Required" })}
              />
              {errors.checkAmount?.message && (
                <p className="text-red-500 text-xs italic">
                  {errors.checkAmount?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Dealer Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-city"
                type="text"
                placeholder=""
                {...register("dealerName", { required: "Required" })}
              />
              {errors.dealerName?.message && (
                <p className="text-red-500 text-xs italic">
                  {errors.dealerName?.message}
                </p>
              )}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                User Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder=""
                {...register("userName", { required: "Required" })}
              />
              {errors.userName?.message && (
                <p className="text-red-500 text-xs italic">
                  {errors.userName?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center pt-10">
            <button
              className="btn btn-wide flex items-center justify-center bg-red-500 hover:bg-red-400 text-white disabled:bg-red-300 disabled:text-white disabled:cursor-not-allowed"
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? "Loading..." : "Enter"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

interface FormData {
  registerNumber: string;
  checkAmount: string;
  dealerName: string;
  userName: string;
}

export default Form;
