import React from "react";
import { RiCurrencyFill } from "react-icons/ri";
import { RxCodesandboxLogo } from "react-icons/rx";
import { IoIosTrendingUp } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { CiUser } from "react-icons/ci";

const MonthlySummary = ({
  monthly,
  monthlyOrder,
  trending,
  stock,
  userMonthly,
}) => {
  return (
    <div className="min-w-full bg-white shadow-2xl px-7 py-4 rounded-md h-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Summary</h2>
      <p className="text-sm text-gray-600">
        Summary of some key metrics of current month
      </p>
      <div className="mt-4 flex flex-col gap-5 justify-between">
        <div className="flex items-center">
          <span className="text-2xl">
            <RiCurrencyFill />
          </span>
          <div className="flex flex-col pl-4 text-xs tracking-tighter">
            <span className="text-sm font-medium">Total sales this month</span>
            <span className="text-sm">
              This month's sales{" "}
              <span className="pl-3 font-bold">
                ${monthly && monthly.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl">
            <RxCodesandboxLogo />
          </span>
          <div className="flex flex-col pl-4 text-xs tracking-tighter">
            <span className="text-sm font-medium">Total Orders placed</span>
            <span className="text-sm">
              Total Orders placed{" "}
              <span className="pl-3 font-bold">
                {monthlyOrder && monthlyOrder}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl">
            <IoIosTrendingUp />
          </span>
          <div className="flex flex-col pl-4 text-xs tracking-tighter">
            <span className="text-sm font-medium">
              Top selling products this month
            </span>
            <span className="text-sm">
              Best Seller:
              <span className="pl-1 font-bold">
                {trending && trending.length > 0 ? trending[0].name : ""}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl">
            <IoWarning />
          </span>
          <div className="flex flex-col pl-4 text-xs tracking-tighter">
            <span className="text-sm font-medium">Low stock products</span>
            <span className="text-sm">
              <span className="font-bold">{stock}</span> products running low on
              stock
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl">
            <CiUser />
          </span>
          <div className="flex flex-col pl-4 text-xs tracking-tighter">
            <span className="text-sm font-medium">
              New customers this month
            </span>
            <span className="text-sm">
              New customers joined{" "}
              <span className="pl-3 font-bold">
                {userMonthly && userMonthly.length > 0
                  ? userMonthly[0].total
                  : "0"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
