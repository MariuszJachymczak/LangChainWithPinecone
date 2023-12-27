import { response } from './BasicExample';
import { ragResponse } from './Rag';

const LangchainRender: React.FC = () => {
  return (
    <div>
      {response}
      {ragResponse}
    </div>
  );
};
export default LangchainRender;
