export class NextResponse {
  static next() {
    return {
      headers: new Headers(),
    };
  }
}
