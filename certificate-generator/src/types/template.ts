export interface Template {
  id: number;
  name: string;
  image: string;
  placeholders: {
    recipientName: {
      x: number;
      y: number;
    };
    fromDate: {
      x: number;
      y: number;
    };
    toDate: {
      x: number;
      y: number;
    };
  };
}