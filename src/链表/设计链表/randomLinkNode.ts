export default class RandomLinkNode {
  val: number;

  next: RandomLinkNode | null;

  random: RandomLinkNode | null;

  constructor(val: number, next?: RandomLinkNode | null, random?: RandomLinkNode | null) {
    this.val = val;
    this.next = next ?? null;
    this.random = random ?? null;
  }
}
