interface BadgeOptions {
  text: string;
  radius: number;
  background: string;
  color: string;
  borderColor: string;
  // offset location of badge
  bx: number;
  by: number;
  // Character offsets and size choice
  cx?: number;
  cy?: number;
  csize?: number; // defaults to diameter size
  cface?: string; // font to use for character
}

const DEFAULT_BADGE_OPTIONS: BadgeOptions = {
  text: "+",
  radius: 10,
  background: "#da1e28",
  color: "white",
  borderColor: "white",
  bx: 15,
  by: -30,
};

/**
 * Badge class for adding a number / count / asterisk badge to a visible node
 *
 * @class Badge
 */
export default class Badge {
  private _badgeOptions: BadgeOptions = DEFAULT_BADGE_OPTIONS;
  private _fontOptions: any = { face: "sans-serif" };
  private readonly _body: any;
  private _showBadge = false;

  /**
   * The text for the badge
   *
   * @readonly
   * @type {string}
   * @memberof Badge
   */
  public get Text(): string {
    return this._badgeOptions.text;
  }
  /**
   * The radius of the badge
   *
   * @readonly
   * @type {number}
   * @memberof Badge
   */
  public get Radius(): number {
    return this._badgeOptions.radius;
  }
  /**
   * The colour of the badge background (default red-ish)
   *
   * @readonly
   * @type {string}
   * @memberof Badge
   */
  public get Background(): string {
    return this._badgeOptions.background;
  }
  /**
   * The colour of the badge text
   *
   * @readonly
   * @type {string}
   * @memberof Badge
   */
  public get Color(): string {
    return this._badgeOptions.color;
  }
  /**
   * The colour of the border around the badge
   *
   * @readonly
   * @type {string}
   * @memberof Badge
   */
  public get BorderColor(): string {
    return this._badgeOptions.borderColor;
  }
  /**
   * The diameter of the circle
   *
   * @readonly
   * @type {number}
   * @memberof Badge
   */
  public get Diameter(): number {
    return this.Radius * 2;
  }
  /**
   * The horizontal offset of the badge location to the position of the node
   *
   * @readonly
   * @type {number}
   * @memberof Badge
   */
  public get HorizonalOffset(): number {
    return this._badgeOptions.bx;
  }
  /**
   * The vertical offset of the badge location to the position of the node
   *
   * @readonly
   * @type {number}
   * @memberof Badge
   */
  public get VerticalOffset(): number {
    return this._badgeOptions.by;
  }

  public get CharacterHorizontalOffset(): number {
    return this._badgeOptions.cx || this.Radius;
  }

  public get CharacterVerticalOffset(): number {
    return this._badgeOptions.cy || this.Radius;
  }

  public get CharacterFontSize(): number {
    return this._badgeOptions.csize || this.Diameter;
  }
  /**
   *Creates an instance of Badge.
   *
   * @param body - The body into which this badge is destined to live
   * @param badgeOptions - The badge options to apply to this instance, see BadgeOptions interface
   * @param fontOptions
   * @memberof Badge
   */
  constructor(body: any, badgeOptions: any, fontOptions: any) {
    this._body = body;
    this._fontOptions = { ...this._fontOptions, ...fontOptions };
    this.updateOptions(badgeOptions);
  }

  private drawCircle(ctx: any, x: number, y: number): void {
    ctx.fillStyle = this.Background;
    ctx.strokeStyle = this.BorderColor;

    ctx.beginPath();
    ctx.arc(x, y, this.Radius, 0, Math.PI * 2, true);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }

  private drawText(ctx: any, x: number, y: number): void {
    ctx.font = `${this.CharacterFontSize}px ${this._fontOptions.face}`;
    ctx.fillStyle = this.Color;

    ctx.beginPath();
    ctx.fillText(
      this.Text,
      x - this.CharacterHorizontalOffset,
      y - this.CharacterVerticalOffset
    );
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Updates the badge options
   * Particularly useful when neededing to add or remove a badge on the node by updating it
   *
   * @param badgeOptions - new set of badge options to apply
   * @memberof Badge
   */
  public updateOptions(badgeOptions: any) {
    this._showBadge = !!badgeOptions;
    this._badgeOptions = {
      ...this._badgeOptions,
      ...badgeOptions,
    };
    if (this._badgeOptions.cface) {
      this._fontOptions.face = this._badgeOptions.cface;
    }
  }

  /**
   * draw the badge in place
   *
   * @param ctx - canvas context
   * @param x - horizontal position at which to draw the SVG
   * @param y - vertical postiion at which to draw the SVG
   * @returns
   * @memberof Badge
   */
  public draw(ctx: any, x: number, y: number): void {
    if (!this._showBadge) return;

    // Draw the image on top of the node, offset by a particular amount
    this.drawCircle(ctx, x + this.HorizonalOffset, y - this.VerticalOffset);
    this.drawText(ctx, x + this.HorizonalOffset, y - this.VerticalOffset);
  }
}
