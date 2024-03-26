import { Profile } from "./interfaces/profile";
import { assertKeyword, callKeyword, caseKeyword, catchKeyword, classKeyword, commentMarker, constantKeyword, defaultKeyword, eachKeyword, elseKeyword, enumKeyword, externalKeyword, forKeyword, functionKeyword, ifKeyword, inputKeyword, mainKeyword, printKeyword, procedureKeyword, propertyKeyword, repeatKeyword, returnKeyword, setKeyword, switchKeyword, testKeyword, throwKeyword, tryKeyword, varKeyword, whileKeyword } from "./keywords";

export class DefaultProfile implements Profile {
    name: string = "default profile";
    globals: string[] = [mainKeyword,procedureKeyword, functionKeyword, classKeyword, constantKeyword, enumKeyword, testKeyword, commentMarker];
    statements: string[] = [assertKeyword, callKeyword, caseKeyword, catchKeyword, defaultKeyword, eachKeyword, elseKeyword, externalKeyword, forKeyword, ifKeyword, inputKeyword, printKeyword, repeatKeyword, returnKeyword, setKeyword, switchKeyword, throwKeyword, tryKeyword, varKeyword, whileKeyword, commentMarker];
    class_members: string[] = [functionKeyword, procedureKeyword, propertyKeyword, "abstract function", "abstract procedure", "abstract property", commentMarker];
    include_profile_name_in_header: boolean = false;
    can_load_only_own_files: boolean = false;
}