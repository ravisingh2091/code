class DateTime {
  //@ts-ignore
  public get getDateUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

}

export default new DateTime();
