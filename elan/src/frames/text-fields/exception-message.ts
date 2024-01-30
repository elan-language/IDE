import { Text } from "./text";
import { TextFieldHolder } from "../TextFieldHolder";


//Must be a literal string or an identifier 
export class ExceptionMessage extends Text {
    getPrefix(): string {
        return 'msg';
    }
    
    constructor(holder: TextFieldHolder) {
        super(holder);
        this.setPrompt("message");
    }
}