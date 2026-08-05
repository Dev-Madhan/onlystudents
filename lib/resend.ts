

import {Resend} from "resend";
import {env} from "@/lib/env";


export const resend = new Resend(env.RESEND_API_KEY);

export const EMAIL_SENDER = env.RESEND_FROM_EMAIL;