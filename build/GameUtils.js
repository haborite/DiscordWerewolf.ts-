"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHashValueWithFormat = exports.arrange_components = exports.arrange_buttons = exports.make_button = exports.loadAndSetSysRuleSet = exports.loadAttachedJson5 = exports.shuffle = exports.assertUnreachable = exports.isThisCommand = exports.format = exports.GameChannels = void 0;
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const ts_json_validator_1 = require("ts-json-validator");
const JsonType_1 = require("./JsonType");
var JSON5 = require('json5');
const path = __importStar(require("path"));
class GameChannels {
    Mason;
    Werewolf;
    GameLog;
    DebugLog;
    Living;
    LivingVoice;
    Dead;
    DeadVoice;
    constructor(aMason, aWerewolf, aGameLog, aDebugLog, aLiving, aLivingVoice, aDead, aDeadVoice) {
        this.Mason = aMason;
        this.Werewolf = aWerewolf;
        this.GameLog = aGameLog;
        this.DebugLog = aDebugLog;
        this.Living = aLiving;
        this.LivingVoice = aLivingVoice;
        this.Dead = aDead;
        this.DeadVoice = aDeadVoice;
    }
    clear_category(client, parentID) {
        try {
            const category = client.channels.cache.get(parentID);
            if (category) {
                const manager = category.children;
                manager.cache.forEach((ch) => { ch.delete(); });
                category.delete();
            }
            console.log('Channels and category deleted successfully.');
        }
        catch (error) {
            console.log('Error deleting channels and category:', error);
        }
    }
}
exports.GameChannels = GameChannels;
function format(msg, obj) {
    return msg.replace(/\{(\w+)\}/g, (m, k) => {
        return obj[k];
    });
}
exports.format = format;
function isThisCommand(content, list) {
    return list.findIndex(cmd => content.startsWith(cmd));
}
exports.isThisCommand = isThisCommand;
function assertUnreachable(x) {
    throw new Error("Didn't expect to get here");
}
exports.assertUnreachable = assertUnreachable;
function shuffle(array) {
    const out = Array.from(array);
    for (let i = out.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = out[i];
        out[i] = out[r];
        out[r] = tmp;
    }
    return out;
}
exports.shuffle = shuffle;
async function loadAttachedJson5(attachments) {
    const attachmentURL = attachments.first()?.url;
    if (attachmentURL) {
        if (path.extname(attachmentURL).replace(/\?.*/, '') === '.json5') {
            try {
                const res = await fetch(attachmentURL);
                if (!res.ok) {
                    console.log(`HTTP error! Status: ${res.status}`);
                    return;
                }
                const txt = await res.text();
                const json5_content = JSON5.parse(txt);
                const ret = (0, ts_json_validator_1.validate)(JsonType_1.RuleTypeFormat, json5_content);
                return ret;
            }
            catch (error) {
                console.error('Error parsing JSON5 file:', error);
                return;
            }
        }
    }
}
exports.loadAttachedJson5 = loadAttachedJson5;
function loadAndSetSysRuleSet(path, RuleSet) {
    const data = fs.readFileSync(path, 'utf-8');
    const json5 = JSON5.parse(data);
    try {
        const ret = (0, ts_json_validator_1.validate)(JsonType_1.RuleTypeFormat, json5);
        if (ret != null) {
            RuleSet = ret;
        }
        return ret;
    }
    catch (e) {
        console.log(e);
    }
}
exports.loadAndSetSysRuleSet = loadAndSetSysRuleSet;
function make_button(id, label, opt) {
    const res = new Discord.ButtonBuilder().setCustomId(id).setLabel(label);
    if (opt.emoji)
        res.setEmoji(opt.emoji);
    if (opt.style) {
        if (opt.style == Discord.ButtonStyle.Primary || opt.style == "blue")
            res.setStyle(Discord.ButtonStyle.Primary);
        if (opt.style == Discord.ButtonStyle.Success || opt.style == "green")
            res.setStyle(Discord.ButtonStyle.Success);
        if (opt.style == Discord.ButtonStyle.Secondary || opt.style == "black")
            res.setStyle(Discord.ButtonStyle.Secondary);
        if (opt.style == Discord.ButtonStyle.Danger || opt.style == "red")
            res.setStyle(Discord.ButtonStyle.Danger);
        if (opt.style == Discord.ButtonStyle.Link)
            res.setStyle(Discord.ButtonStyle.Link);
    }
    return res;
}
exports.make_button = make_button;
function arrange_buttons(buttons) {
    const rows = Math.ceil(buttons.length / 5);
    const components = [];
    for (let i = 0; i < rows; ++i) {
        components[i] = new Discord.ActionRowBuilder();
    }
    for (let i = 0; i < buttons.length; ++i) {
        components[i % rows].addComponents(buttons[i]);
    }
    return components;
}
exports.arrange_buttons = arrange_buttons;
function arrange_components(c) {
    const res = [];
    for (let i = 0; i < c.length; ++i) {
        const j = Math.floor(i / 5);
        if (i % 5 == 0)
            res[j] = [];
        res[j].push(c[i]);
    }
    return res;
}
exports.arrange_components = arrange_components;
function updateHashValueWithFormat(attribute, value, runtimeType, hash) {
    const delimiters = ['/', '\\', '.'];
    switch (runtimeType) {
        case 'null':
        case 'boolean':
        case 'number':
        case 'string':
            return false;
        default:
            if (runtimeType.base == "object") {
                let dpos = attribute.length;
                for (const d of delimiters) {
                    const v = attribute.indexOf(d);
                    if (v >= 1)
                        dpos = Math.min(dpos, v);
                }
                const attr = attribute.substring(0, dpos);
                if (!(attr in runtimeType.keyValues))
                    return false;
                if (!(attr in hash))
                    return false;
                const chT = runtimeType.keyValues[attr];
                if (chT == 'null') {
                }
                else if (chT == 'boolean') {
                    value = value.toLowerCase();
                    const Trues = ['on', 'yes', 'y', 'true', 't', '1'];
                    const Falses = ['off', 'no', 'n', 'false', 'f', '0'];
                    if (Trues.indexOf(value) >= 0) {
                        hash[attr] = true;
                        return true;
                    }
                    if (Falses.indexOf(value) >= 0) {
                        hash[attr] = false;
                        return true;
                    }
                    return false;
                }
                else if (chT == 'number') {
                    const v = parseInt(value);
                    if (v.toString() == value) {
                        hash[attr] = v;
                        return true;
                    }
                }
                else if (chT == 'string') {
                    hash[attr] = value;
                    return true;
                }
                else if (chT.base == 'union') {
                    for (let doLower = 0; doLower <= 1; ++doLower) {
                        for (const elem of chT.elements) {
                            if (elem == 'null' || elem == 'boolean' || elem == 'number' || elem == 'string') {
                            }
                            else if (elem.base == 'literal') {
                                if ((doLower == 0 && elem.value == value) ||
                                    (doLower == 1 && elem.value.toLowerCase() == value.toLowerCase())) {
                                    hash[attr] = elem.value;
                                    return true;
                                }
                            }
                        }
                    }
                }
                else if (chT.base == 'optional') {
                    if (chT.element == 'string') {
                        hash[attr] = value;
                        return true;
                    }
                    else if (chT.element == 'number') {
                        const v = parseInt(value);
                        if (v.toString() == value) {
                            hash[attr] = v;
                            return true;
                        }
                    }
                }
                else if (chT.base == 'object') {
                    if (dpos != attribute.length) {
                        return updateHashValueWithFormat(attribute.substring(dpos + 1, attribute.length), value, chT, hash[attr]);
                    }
                }
                return false;
            }
    }
    return false;
}
exports.updateHashValueWithFormat = updateHashValueWithFormat;
//# sourceMappingURL=GameUtils.js.map