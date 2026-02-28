import { X, Clock, CopyPlus } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import {
  ModalContent,
  HoursDetails,
  HoursMain,
  XButton,
  Detail,
  DetailName,
  DetailWrapper,
  CopyToAll,
  WeekDay,
  HoursSelect,
} from "./styled";
import { LoginButton } from "@/pages/Login/styled";
import { useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";

export interface DayHours {
  day: string;
  open: string;
  close: string;
}

interface HoursModalProps {
  onClose: () => void;
  onSave: (hours: DayHours[]) => Promise<void>;
  initialData: DayHours[];
}

const timeOptions = Array.from({ length: 48 }).map((_, i) => {
  const hours = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

function HoursModal({ onClose, onSave, initialData }: HoursModalProps) {
  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [localHours, setLocalHours] = useState<DayHours[]>(() => {
    return allDays.map((day) => {
      const existingDay = initialData?.find(
        (d) => d.day.toLowerCase() === day.toLowerCase(),
      );

      return existingDay || { day, open: "00:00", close: "00:00" };
    });
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleHourChange = (
    index: number,
    field: "open" | "close",
    value: string,
  ) => {
    const updatedHours = [...localHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setLocalHours(updatedHours);
  };

  const handleReplicate = () => {
    const firstDay = localHours[0];
    const replicated = localHours.map((h) => ({
      ...h,
      open: firstDay.open,
      close: firstDay.close,
    }));
    setLocalHours(replicated);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (initialData !== localHours) {
        await onSave(localHours);
      }
      setTimeout(() => {}, 100);
    } catch (e) {
      console.log(e);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  const translateDay = (day: string) => {
    if (day.toLowerCase() === "monday") {
      return "segunda";
    } else if (day.toLowerCase() === "tuesday") {
      return "terça";
    } else if (day.toLowerCase() === "wednesday") {
      return "quarta";
    } else if (day.toLowerCase() === "thursday") {
      return "quinta";
    } else if (day.toLowerCase() === "friday") {
      return "sexta";
    } else if (day.toLowerCase() === "saturday") {
      return "sábado";
    } else if (day.toLowerCase() === "sunday") {
      return "domingo";
    }
  };

  return (
    <ModalOverlay
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ModalContainer
        className="hours"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "650px" }}
        variants={modalVariants}
      >
        <ModalHeader style={{ display: "flex", gap: "5px" }}>
          <CopyToAll onClick={handleReplicate}>
            <CopyPlus size={14} /> Copiar segunda p/ todos
          </CopyToAll>
          <XButton onClick={onClose}>
            <X size={30} />
          </XButton>
        </ModalHeader>

        <ModalContent>
          <HoursMain>
            <Clock size={32} />
            <h1>Horários de Funcionamento</h1>
          </HoursMain>

          <HoursDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
            {localHours?.map((item, index) => (
              <DetailWrapper key={item.day}>
                <Detail>
                  <DetailName>Dia</DetailName>
                  <WeekDay>{translateDay(item.day)}</WeekDay>
                </Detail>

                <Detail>
                  <DetailName>Abertura</DetailName>
                  <HoursSelect
                    value={item.open}
                    onChange={(e) =>
                      handleHourChange(index, "open", e.target.value)
                    }
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </HoursSelect>
                </Detail>

                <Detail>
                  <DetailName>Fechamento</DetailName>
                  <HoursSelect
                    value={item.close}
                    onChange={(e) =>
                      handleHourChange(index, "close", e.target.value)
                    }
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </HoursSelect>
                </Detail>
              </DetailWrapper>
            ))}
          </HoursDetails>

          <LoginButton
            onClick={handleSave}
            disabled={isLoading}
            style={{ marginTop: "10px" }}
          >
            {isLoading ? <Spinner /> : "Salvar"}
          </LoginButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default HoursModal;
