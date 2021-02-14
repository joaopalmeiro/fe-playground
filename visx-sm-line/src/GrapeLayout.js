function GrapeLayout() {
  return (
    <div className="flex flex-column">
      <div className="outline w-100 pa3 flex justify-center">
        <div className="outline w-third pa3 mr2">
          <code>1.1</code>
        </div>
        <div className="outline w-third pa3">
          <code>1.2</code>
        </div>
      </div>
      <div className="outline w-100 pa3 mt2 flex">
        <div className="outline w-third pa3 mr2">
          <code>2.1</code>
        </div>
        <div className="outline w-third pa3 mr2">
          <code>2.2</code>
        </div>
        <div className="outline w-third pa3">
          <code>2.3</code>
        </div>
      </div>
      <div className="outline w-100 pa3 mt2 flex justify-center">
        <div className="outline w-third pa3 mr2">
          <code>3.1</code>
        </div>
        <div className="outline w-third pa3 mr">
          <code>3.2</code>
        </div>
      </div>
      <div className="outline w-100 pa3 mt2 flex justify-center">
        <div className="outline w-third pa3">
          <code>4.1</code>
        </div>
      </div>
    </div>
  );
}

export default GrapeLayout;
