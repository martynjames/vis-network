interface BadgeOptions {
  text: string;
  radius: number;
  background: string;
  color: string;
  borderColor: string;
  bx: number;
  by: number;
}

const DEFAULT_BADGE_OPTIONS: BadgeOptions = {
  text: "+",
  radius: 10,
  background: "#da1e28",
  color: "white",
  borderColor: "white",
  // offset location of badge
  bx: 15,
  by: -30,
};

/**
 * Badge class for adding a number / count / asterisk badge to a visible node
 *
 * @export
 * @class Badge
 */
export default class Badge {
  private _badgeOptions: BadgeOptions = DEFAULT_BADGE_OPTIONS;
  private readonly _body: any;
  private _showBadge: boolean = false;

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
  /**
   *Creates an instance of Badge.
   * @param {*} body
   * The body into which this badge is destined to live
   * @param {*} badgeOptions
   * The badge options to apply to this instance, see BadgeOptions interface
   * @memberof Badge
   */
  constructor(body: any, badgeOptions: any) {
    this._body = body;
    this.updateOptions(badgeOptions);
  }

  /**
   * Fetch the SVG data for the badge
   *
   * @private
   * @param {*} ctx
   * canvas context
   * @returns {string}
   * SVG data
   * @memberof Badge
   */
  private _getSVGData(ctx: any): string {
    const circleStyle = `fill:${this.Background};stroke:${this.BorderColor};stroke-width:1`;
    const textStyle = `stroke:${this.Color};fill:${this.Color};font-size:${this.Diameter}px;`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <svg xmlns="http://www.w3.org/2000/svg"
      width="${this.Diameter}px"
      height="${this.Diameter}px"
      viewBox="0 0 ${this.Diameter} ${this.Diameter}"
      version="1.1">
        <g transform="scale(1 1)">
          <circle
            r="${this.Radius}"
            cy="${this.Radius}"
            cx="${this.Radius}"
            style="${circleStyle}" />
            <text
              y="${1.5 * this.Radius}"
              x="${0.4 * this.Radius}"
              style="${textStyle}line-height:1;font-family:sans-serif;">
            ${this.Text}
          </text>
        </g>
      </svg>
    `;
  }

  /**
   * Updates the badge options
   * Particularly useful when neededing to add or remove a badge on the node by updating it
   *
   * @param {*} badgeOptions
   * new set of badge options to apply
   * @memberof Badge
   */
  public updateOptions(badgeOptions: any) {
    this._showBadge = !!badgeOptions;
    this._badgeOptions = {
      ...this._badgeOptions,
      ...badgeOptions
    };
  }

  /**
   * draw the badge in place
   *
   * @param {*} ctx
   * canvas context
   * @param {number} x
   * horizontal position at which to draw the SVG
   * @param {number} y
   * vertical postiion at which to draw the SVG
   * @returns {void}
   * @memberof Badge
   */
  public draw(ctx: any, x: number, y: number): void {
    if (!this._showBadge) return;

    const svg = new Blob([this._getSVGData(ctx)], {
      type: "image/svg+xml;charset=utf-8"
    });
    const imageUrl = URL.createObjectURL(svg);
    const img = new Image();
    const drawImage = () => {
      try {
        // Because this uses an SVG, it places it in position within the DOM, so we convert co-ordinates from
        // canvasToDom, but the original function is outside of scope from here(or the node object calling here...)
        const translateCoords = (
          x: number,
          y: number,
          bx: number = 0,
          by: number = 0
        ) => {
          const cx = x + bx;
          const cy = y + by;
          return {
            px: cx * this._body.view.scale + this._body.view.translation.x,
            py: cy * this._body.view.scale + this._body.view.translation.y
          };
        };

        // Draw the image on top of the node, offset by a particular amount
        const { px, py } = translateCoords(x, y, this.HorizonalOffset, this.VerticalOffset);
        ctx.drawImage(
          img,
          0,
          0,
          this.Diameter,
          this.Diameter,
          px,
          py,
          this.Diameter * this._body.view.scale,
          this.Diameter * this._body.view.scale
        );
      } finally {
        // this code in a finally handler in order to ensure that the resources are cleaned up appropirately
        img.removeEventListener("load", drawImage);
        URL.revokeObjectURL(imageUrl);
      }
    };
    img.addEventListener("load", drawImage);
    img.src = imageUrl;
  }
}
