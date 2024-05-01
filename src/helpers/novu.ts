import { Novu } from "@novu/node";
import conf from "@/conf/conf";

const novu = new Novu(conf.novuApiKey);

export default novu;
