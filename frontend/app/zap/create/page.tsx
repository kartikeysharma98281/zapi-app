"use client";

import { BACKEND_URL } from "@/app/cofig";
import { AppBar } from "@/components/AppBar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimayButton";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/ZapCell";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((x) => setAvailableTriggers(x.data.availableTriggers));

    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((x) => setAvailableActions(x.data.availableActions));
  }, []);

  return {
    availableActions,
    availableTriggers,
  };
}

export default function CreateZap() {
  const router = useRouter();
  const { availableActions, availableTriggers } =
    useAvailableActionsAndTriggers();
  const [slectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
  }>();
  const [selctedActions, setSelectedActions] = useState<
    {
      index: number;
      availableActionId: string;
      availableActionName: string;
      metaData:any;
    }[]
  >([]);
  const [selectedModalInddex, setSelectedModalIndex] = useState<null | number>(
    null
  );
  return (
    <div>
      <AppBar />
      <div className="flex justify-end bg-slate-200 p-4">
        <PrimaryButton
          onClick={async () => {
            if (!slectedTrigger?.id) {
              return;
            }
            const response = await axios.post(
              `${BACKEND_URL}/api/v1/zap/create`,
              {
                availableTriggerId: slectedTrigger.id,
                triggerMetaData: {},
                actions: selctedActions.map((a) => ({
                  availableActionsId: a.availableActionId,
                  actionMetaData: a.metaData,
                })),
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
            router.push("/dashboard");
          }}
        >
          Publish
        </PrimaryButton>
      </div>
      <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
        <div className="flex justify-center w-full ">
          <ZapCell
            name={slectedTrigger?.name ? slectedTrigger.name : "Trigger"}
            index={1}
            onClick={() => {
              setSelectedModalIndex(1);
            }}
          />
        </div>
        <div className=" w-full pt-2 pb-2">
          {selctedActions.map((action, index) => (
            <div className="pt-2 flex justify-center" key={index}>
              {" "}
              <ZapCell
                name={
                  action.availableActionName
                    ? action.availableActionName
                    : "Action"
                }
                index={action.index}
                onClick={() => {
                  setSelectedModalIndex(action.index);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div>
            <PrimaryButton
              onClick={() => {
                setSelectedActions((a) => [
                  ...a,
                  {
                    index: a.length + 2,
                    availableActionId: "",
                    availableActionName: "",
                    metaData: {}
                  },
                ]);
              }}
            >
              <div className="text-2xl ">+</div>
            </PrimaryButton>
          </div>
        </div>
      </div>
      {selectedModalInddex && (
        <Modal
          availableItems={
            selectedModalInddex == 1 ? availableTriggers : availableActions
          }
          onSelect={(props: null | { name: string; id: string; metaData:any; }) => {
            if (props == null) {
              setSelectedModalIndex(null);
              return;
            }
            if (selectedModalInddex == 1) {
              setSelectedTrigger({
                id: props.id,
                name: props.name,
              });
            } else {
              setSelectedActions((a) => {
                let newActions = [...a];
                newActions[selectedModalInddex - 2] = {
                  index: selectedModalInddex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                  metaData:props.metaData
                };
                return newActions;
              });
            }
            setSelectedModalIndex(null);
          }}
          index={selectedModalInddex}
        />
      )}
    </div>
  );
}

function Modal({
  index,
  onSelect,
  availableItems,
}: {
  index: number;
  onSelect: (props: null | { name: string; id: string; metaData:any; }) => void;
  availableItems: { id: string; name: string; image: string; metaData:any }[];
}) {
  const [step, setStep] = useState(0);
  const [selctedActions, setSelectedActions] = useState<{
    id: string;
    name: string;
}>();
  const isTrigger = index === 1;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <div className="text-xl">
              Select {index == 1 ? "Trigger" : "Action"}
            </div>
            <button
              onClick={() => {
                onSelect(null);
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
              data-modal-hide="default-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {step === 1 && selctedActions?.id === "email" && <EmailSelector setMetaData={(metaData)=>{
              onSelect({
                ...selctedActions,
                metaData
              });
            }} />}
            {step === 1 && selctedActions?.id === "send-sol" && <SolanaSelector setMetaData={(metaData)=>{
              onSelect({
                ...selctedActions,
                metaData
              });
            }} />}
            {step === 0 && (
              <div>
                {availableItems.map(
                  ({
                    id,
                    name,
                    image,
                  }: {
                    id: string;
                    name: string;
                    image: string;
                  }) => {
                    return (
                      <div
                        onClick={() => {
                          if (isTrigger) {
                            onSelect({
                              id,
                              name,
                              metaData: {}
                            });
                          } else {
                            setStep((s) => s + 1);
                            setSelectedActions({
                              id,
                              name,
                            });
                          }
                        }}
                        key={id}
                        className="flex border p-4 cursor-pointer hover:bg-slate-100"
                      >
                        <img src={image} width={30} className="rouded-full" />{" "}
                        <div className="flex flex-col justify-center">
                          {name}
                        </div>
                      </div>
                    );
                  }
                )}{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSelector({setMetaData}: {
  setMetaData: (params:any)=>void;
}){
  const [email , setEmail] = useState('');
  const [body , setBody] = useState('');
  return <div>
    <Input label={"To"} type={"text"} placeholder="To" onChange={()=>{setEmail(e.target.value)}}></Input>
    <Input label={"Body"} type={"text"} placeholder="Body" onChange={()=>{setBody(e.target.value)}}></Input>
    <div className="pt-2">
    <PrimaryButton onClick={()=>[
      setMetaData({
        email,
        body
      })
    ]}>Submit</PrimaryButton>
    </div>
  </div>
}

function SolanaSelector({setMetaData}: {
  setMetaData: (params:any)=>void;
}){
  const [address , setAddress] = useState("");
  const [amount , setAmount] = useState("");

  return <div>
    <Input label={"Address"} type={"text"} placeholder="Address" onChange={(e)=>{setAddress(e.target.value)}}></Input>
    <Input label={"Amount"} type={"text"} placeholder="Amount" onChange={(e)=>{setAmount(e.target.value)}}></Input>
    <div className="pt-4">
    <PrimaryButton onClick={()=>[
      setMetaData({
        amount,
        address
      })
    ]}>Submit</PrimaryButton>
    </div>
  </div>
}