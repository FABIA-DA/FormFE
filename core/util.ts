export class Util{
  public static truncate(text: string): string {
    const maxLength: number = 30;
    const placeholder: string = '.'.repeat(3);
    const maxTextLength: number = maxLength - placeholder.length;

    if(text.length <= maxTextLength) {
      return text;
    } else {
      return text.substring(0, maxTextLength).concat(placeholder);
    }
  }
}
