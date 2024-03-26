import { Each } from "./statements/each";
import { Call } from "./statements/call";
import { For } from "./statements/for";
import { IfStatement } from "./statements/if-statement";
import { Print } from "./statements/print";
import { Repeat } from "./statements/repeat";
import { Throw } from "./statements/throw";
import { While } from "./statements/while";
import { TryCatch } from "./statements/try-catch";
import { VariableDefStatement } from "./statements/variable-def-statement";
import { SetStatement } from "./statements/set-statement";
import { StatementFactory } from "./interfaces/statement-factory";
import { Frame } from "./interfaces/frame";
import { Switch } from "./statements/switch";
import { Parent } from "./interfaces/parent";
import { CommentStatement } from "./statements/comment-statement";
import { ReturnStatement } from "./statements/return-statement";
import { Else } from "./statements/else";
import { Default } from "./statements/default";
import { Catch } from "./statements/catch";
import { Case } from "./statements/case";
import { Assert } from "./statements/assert";
import { Input } from "./statements/input";
import { ExternalStatement } from "./statements/external-statement";

export class StatementFactoryImpl implements StatementFactory {

    public newAssert(parent: Parent): Frame { return new Assert(parent); }
    public newCall(parent: Parent): Frame { return new Call(parent); }
    public newCase(parent: Parent): Frame { return new Case(parent); }
    public newCatch(parent: Parent): Frame { return new Catch(parent); }
    public newDefault(parent: Parent): Frame { return new Default(parent); }
    public newEach(parent: Parent): Frame { return new Each(parent); }
    public newElse(parent: Parent): Frame { return new Else(parent); }
    public newExternal(parent: Parent): Frame { return new ExternalStatement(parent); }
    public newFor(parent: Parent): Frame { return new For(parent); }
    public newIf(parent: Parent): Frame { return new IfStatement(parent); }
    public newInput(parent: Parent): Frame { return new Input(parent); }
    public newPrint(parent: Parent): Frame { return new Print(parent); }
    public newRepeat(parent: Parent): Frame { return new Repeat(parent); }
    public newReturn(parent: Parent): Frame { return new ReturnStatement(parent); }
    public newSet(parent: Parent): Frame { return new SetStatement(parent); }
    public newSwitch(parent: Parent): Frame { return new Switch(parent); }
    public newThrow(parent: Parent): Frame { return new Throw(parent); }
    public newTryCatch(parent: Parent): Frame { return new TryCatch(parent); }
    public newVar(parent: Parent): Frame { return new VariableDefStatement(parent); }
    public newWhile(parent: Parent): Frame { return new While(parent); }
    public newComment(parent: Parent): Frame { return new CommentStatement(parent); }
}