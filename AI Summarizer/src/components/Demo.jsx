import {useState, useEffect} from 'react'; // Removed 'use' as it's not a standard React hook
import {copy, linkIcon, loader, tick} from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  const [article, setArticle] = useState({url: '', summary: ''});
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'))
    if (articlesFromLocalStorage){
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    // 1. Check if the article already exists in history
    const existingArticle = allArticles.find((item) => item.url === article.url);

    if (existingArticle) {
      setArticle(existingArticle); // Display the existing summary
      return; // Stop the function here, no need to make an API call
    }

    // If it's a new article, proceed with API call
    const { data } = await getSummary({ url: article.url });

    if (data?.summary) {
      const newArticle = {
        ...article, summary: data.summary
      };
      const updatedAllArticles = [newArticle, ...allArticles];
      setAllArticles(updatedAllArticles);
      setArticle(newArticle);
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  // Added handleKeyDown for Enter key submission
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { // 13 is the keyCode for the Enter key
      handleSubmit(e);
    }
  };


  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form className="relative flex justify-center items-center" onSubmit={handleSubmit}>
          <img src={linkIcon} alt="link_icon" className="absolute left-0 my-2 ml-3 w-5" />
          <input
            type="url"
            placeholder="Paste your article link here..."
            value={article.url}
            onChange={(e) => setArticle({...article, url: e.target.value})}
            onKeyDown={handleKeyDown} // Added onKeyDown handler
            required
            className="url_input peer"
          />
          <button type="submit" className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 ">
            {isFetching ? ( // Changed to show loader directly on button while fetching
              <img src={loader} alt="Loader" className="w-5 h-5" />
            ) : (
              <img src={linkIcon} alt="Submit" className="w-5 h-5" /> // Replaced loader with a submit icon when not fetching
            )}
          </button>
        </form>

      {/* Browse URL History */}
      <div className="flex flex-col max-h-60 overflow-y-auto">
        {
          allArticles.map((item, index) => (
            // FIX 2: Corrected onClick to set the 'article' state for display
            <div key={`link-${index}`} onClick={() => setArticle(item)} className='link_card'>
              <div className='copy_btn' onClick={(e) => {e.stopPropagation(); handleCopy(item.url);}}> {/* Added e.stopPropagation() to prevent parent click */}
                <img src={copied === item.url ? tick : copy} alt="copy" className='w-[40%] h-[40%] object-contain' />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>{item.url}</p>
            </div>
          ))
        }
      </div>

      </div>


      {/* Display Summary */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching && !article.summary ? ( // Show loader only when fetching and no summary is displayed yet
          <img src={loader} alt="loader" className="w-10 h-10" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            An error occurred while fetching the summary.
            <br />
            <span className="font-normal">Please try again later.</span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">Article Summary</h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Demo;